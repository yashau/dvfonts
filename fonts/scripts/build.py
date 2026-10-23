"""Build the published font library from sources/ + catalog/families.toml.

For every font in the catalogue this:
  * remaps legacy ASCII-slot Thaana fonts to Unicode Thaana (scripts/legacy.py)
  * rewrites the cmap as clean Unicode (3,1)/(0,3) subtables
  * marks fili as GDEF marks with zero advance, so shapers stack them correctly
  * repairs vertical metrics (hhea == typo, win covers ink, USE_TYPO_METRICS)
  * normalises names / weight class / style bits so families group properly
and writes, per family, under fonts/build/r2/fonts/<id>/ (served from R2 at /fonts/<id>/):
  <id>-<weight>.ttf          full desktop font
  <id>-<weight>.woff2/.woff  full web fonts
  <id>-<weight>.thaana.woff2 / .latin.woff2   unicode-range subsets
  <id>.zip                   desktop download (TTFs + README)
plus apps/web/src/lib/data/catalog.json describing everything for the site.
"""

from __future__ import annotations

import io
import json
import re
import shutil
import sys
import tomllib
import zipfile
from pathlib import Path

from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont, newTable
from fontTools.ttLib.tables import otTables
from fontTools.ttLib.tables._c_m_a_p import cmap_format_4, cmap_format_12

sys.path.insert(0, str(Path(__file__).parent))
from copyright import tidy_copyright  # noqa: E402
from layouts import LAYOUTS  # noqa: E402
from legacy import layout_for  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent  # fonts/
REPO = ROOT.parent
SOURCES = ROOT / "sources"
# Font binaries go to R2 (uploaded by CI / `mise run r2:local`), not git: see
# scripts/r2_manifest.py. Only the small catalog JSON is committed for the site.
FONTS_OUT = ROOT / "build" / "r2" / "fonts"
CATALOG_OUT = REPO / "apps" / "web" / "src" / "lib" / "data" / "catalog.json"
# No dates anywhere in the output: the build is byte-reproducible so CI can
# check that the committed fonts match what this script produces.
BUILD_TAG = "dvfonts"

FILI = range(0x07A6, 0x07B1)
THAANA_LETTERS = range(0x0780, 0x07A6)
ASCII_LETTERS = {*range(0x41, 0x5B), *range(0x61, 0x7B)}

# Optional size normalisation (CSS size-adjust): fonts are scaled so their
# Thaana letters look as big as Faruma's. Letter size is the median over the
# base letters (U+0780-U+07A5, no fili) of sqrt(ink width x ink height), in em:
# height alone shrinks tall, narrow designs too far. Faruma's value is a
# constant so the build stays reproducible.
REFERENCE_LETTER_SIZE = 0.4522

WEIGHT_NAMES = {
    100: "Thin",
    200: "ExtraLight",
    300: "Light",
    400: "Regular",
    500: "Medium",
    600: "SemiBold",
    700: "Bold",
    800: "ExtraBold",
    900: "Black",
}

# unicode-range subsets (CSS API). Overlap on spaces/digits/punctuation is
# intentional: a Thaana-only page then needs just the thaana file.
SUBSETS = {
    "thaana": [
        (0x0780, 0x07BF),
        (0x060C, 0x060C),
        (0x061B, 0x061B),
        (0x061F, 0x061F),
        (0xFDF2, 0xFDF2),
        (0x200C, 0x200F),
        (0x25CC, 0x25CC),
        (0x0020, 0x0040),
        (0x005B, 0x0060),
        (0x007B, 0x007E),
        (0x00A0, 0x00A0),
    ],
    "latin": [
        (0x0000, 0x00FF),
        (0x0131, 0x0131),
        (0x0152, 0x0153),
        (0x02BB, 0x02BC),
        (0x02C6, 0x02C6),
        (0x02DA, 0x02DA),
        (0x02DC, 0x02DC),
        (0x0304, 0x0304),
        (0x0308, 0x0308),
        (0x0329, 0x0329),
        (0x2000, 0x206F),
        (0x20AC, 0x20AC),
        (0x2122, 0x2122),
        (0x2191, 0x2191),
        (0x2193, 0x2193),
        (0x2212, 0x2212),
        (0x2215, 0x2215),
        (0xFEFF, 0xFEFF),
        (0xFFFD, 0xFFFD),
    ],
}


def unicode_range_css(ranges):
    return ", ".join(f"U+{a:04X}" if a == b else f"U+{a:04X}-{b:04X}" for a, b in ranges)


# ─── Font fixes ──────────────────────────────────────────────────────────────


def read_cmap(font: TTFont) -> dict[int, str]:
    """Unicode cmap, folding Windows-symbol (3,0) F0xx codes back to ASCII."""
    out: dict[int, str] = {}
    for t in font["cmap"].tables:
        if t.platformID == 3 and t.platEncID == 0:
            for cp, g in t.cmap.items():
                out.setdefault(cp - 0xF000 if 0xF000 <= cp <= 0xF0FF else cp, g)
    for t in font["cmap"].tables:
        if t.isUnicode():
            for cp, g in t.cmap.items():
                out[cp] = g
    return out


def write_cmap(font: TTFont, mapping: dict[int, str]) -> None:
    bmp = {cp: g for cp, g in mapping.items() if cp <= 0xFFFF}
    tables = []
    for pid, eid in ((0, 3), (3, 1)):
        t = cmap_format_4(4)
        t.platformID, t.platEncID, t.language, t.cmap = pid, eid, 0, dict(bmp)
        tables.append(t)
    if len(bmp) != len(mapping):
        for pid, eid in ((0, 4), (3, 10)):
            t = cmap_format_12(12)
            t.platformID, t.platEncID, t.language, t.cmap = pid, eid, 0, dict(mapping)
            tables.append(t)
    cmap = newTable("cmap")
    cmap.tableVersion = 0
    cmap.tables = tables
    font["cmap"] = cmap


def translate_glyph(font: TTFont, gname: str, dx: float) -> None:
    """Shift a glyph's outline horizontally (TrueType or CFF)."""
    if not dx:
        return
    gs = font.getGlyphSet()
    if "glyf" in font:
        pen = TTGlyphPen(gs)
        gs[gname].draw(TransformPen(pen, Transform(1, 0, 0, 1, dx, 0)))
        g = pen.glyph()
        g.recalcBounds(font["glyf"])
        font["glyf"][gname] = g
    elif "CFF " in font:
        cff = font["CFF "].cff
        top = cff.topDictIndex[0]
        cs = top.CharStrings[gname]
        pen = T2CharStringPen(font["hmtx"][gname][0], gs)
        gs[gname].draw(TransformPen(pen, Transform(1, 0, 0, 1, dx, 0)))
        new = pen.getCharString(private=cs.private, globalSubrs=cs.globalSubrs)
        top.CharStrings[gname] = new


def remap_legacy(font: TTFont, layout: str, cmap: dict[int, str]) -> dict[int, str]:
    """ASCII-slot Thaana -> Unicode. Letters leave their ASCII slots so Latin text
    falls back to a real Latin font instead of rendering as Thaana."""
    keymap = LAYOUTS[layout]
    out = {cp: g for cp, g in cmap.items() if cp not in ASCII_LETTERS and chr(cp) not in keymap}
    for key, uni in keymap.items():
        g = cmap.get(ord(key))
        if g and ord(uni) not in out:
            out[ord(uni)] = g
    # Fili in these fonts carry a small advance (~0-50 units) in visual-LTR order
    # [fili][base]; shapers zero mark advances, so pull the outline back to keep
    # its placement over the base.
    hmtx = font["hmtx"]
    for cp in FILI:
        g = out.get(cp)
        if g:
            adv, lsb = hmtx[g]
            translate_glyph(font, g, -adv)
            hmtx[g] = (0, lsb - adv)
    return out


def ensure_gdef_marks(font: TTFont, cmap: dict[int, str]) -> None:
    """Make sure every fili glyph is classed as a mark (class 3) in GDEF."""
    fili = {cmap[cp] for cp in FILI if cp in cmap}
    if not fili:
        return
    if "GDEF" not in font:
        gdef = newTable("GDEF")
        gdef.table = otTables.GDEF()
        gdef.table.Version = 0x00010000
        for attr in ("GlyphClassDef", "AttachList", "LigCaretList", "MarkAttachClassDef"):
            setattr(gdef.table, attr, None)
        font["GDEF"] = gdef
    t = font["GDEF"].table
    if t.GlyphClassDef is None:
        t.GlyphClassDef = otTables.GlyphClassDef()
        t.GlyphClassDef.classDefs = {}
        letters = {cmap[cp] for cp in THAANA_LETTERS if cp in cmap}
        for g in letters:
            t.GlyphClassDef.classDefs[g] = 1
    for g in fili:
        t.GlyphClassDef.classDefs[g] = 3
    # Zero any leftover mark advances (some Unicode fonts give fili width).
    hmtx = font["hmtx"]
    for g in fili:
        adv, lsb = hmtx[g]
        if adv:
            translate_glyph(font, g, -adv)
            hmtx[g] = (0, lsb - adv)


def size_adjust(path: Path) -> float | None:
    """Scale that makes this font's Thaana letters look as big as Faruma's, for
    `@font-face { size-adjust }`. None for fonts without Unicode Thaana letters.

    Reads its own copy of the file: drawing glyphs decompiles them, and a font
    object that is saved afterwards would then be re-encoded."""
    font = TTFont(path)
    cmap, glyphs, upm = read_cmap(font), font.getGlyphSet(), font["head"].unitsPerEm
    sizes = []
    for cp in range(0x0780, 0x07A6):
        if cp not in cmap:
            continue
        pen = BoundsPen(glyphs)
        glyphs[cmap[cp]].draw(pen)
        if pen.bounds:
            x0, y0, x1, y1 = pen.bounds
            sizes.append(((x1 - x0) * (y1 - y0)) ** 0.5 / upm)
    if len(sizes) < 10:
        return None
    sizes.sort()
    mid = len(sizes) // 2
    median = sizes[mid] if len(sizes) % 2 else (sizes[mid - 1] + sizes[mid]) / 2
    return round(REFERENCE_LETTER_SIZE / median, 3)


def ink_bounds(font: TTFont, glyphs) -> tuple[float, float] | None:
    gs = font.getGlyphSet()
    lo, hi = None, None
    for g in glyphs:
        bp = BoundsPen(gs)
        gs[g].draw(bp)
        if bp.bounds:
            lo = bp.bounds[1] if lo is None else min(lo, bp.bounds[1])
            hi = bp.bounds[3] if hi is None else max(hi, bp.bounds[3])
    return (lo, hi) if lo is not None else None


def fix_vertical_metrics(font: TTFont, cmap: dict[int, str]) -> dict:
    upm = font["head"].unitsPerEm
    hhea, os2 = font["hhea"], font["OS/2"]
    text_cps = [cp for cp in cmap if 0x0780 <= cp <= 0x07B1 or 0x30 <= cp <= 0x39 or cp in ASCII_LETTERS]
    ink = ink_bounds(font, {cmap[cp] for cp in text_cps}) or (-0.3 * upm, 0.9 * upm)
    pad = round(0.02 * upm)
    asc, desc, gap = hhea.ascent, hhea.descent, hhea.lineGap
    sane = asc > 0 and desc < 0 and asc >= ink[1] - pad and -desc >= -ink[0] - pad and asc - desc < 3 * upm
    if not sane:
        asc, desc, gap = round(ink[1] + pad), round(ink[0] - pad), 0
    hhea.ascent, hhea.descent, hhea.lineGap = asc, desc, gap
    os2.sTypoAscender, os2.sTypoDescender, os2.sTypoLineGap = asc, desc, gap
    # win metrics clip on Windows, so cover every glyph's ink.
    allb = ink_bounds(font, font.getGlyphOrder()) or ink
    os2.usWinAscent = max(asc, round(allb[1]), 0)
    os2.usWinDescent = max(-desc, -round(allb[0]), 0)
    return {"repaired": not sane, "ascent": asc / upm, "descent": desc / upm, "lineGap": gap / upm}


def upgrade_os2(font: TTFont) -> None:
    os2 = font["OS/2"]
    if os2.version < 4:
        for attr, val in (
            ("ulCodePageRange1", 1),
            ("ulCodePageRange2", 0),
            ("sxHeight", 0),
            ("sCapHeight", 0),
            ("usDefaultChar", 0),
            ("usBreakChar", 32),
            ("usMaxContext", 0),
        ):
            if not hasattr(os2, attr):
                setattr(os2, attr, val)
        os2.version = 4
    os2.recalcUnicodeRanges(font)


def set_names(font: TTFont, family: str, weight: int, version: str | None) -> None:
    wname = WEIGHT_NAMES[weight]
    ribbi = weight in (400, 700)
    legacy_family = family if ribbi else f"{family} {wname}"
    legacy_sub = "Bold" if weight == 700 else "Regular"
    full = family if weight == 400 else f"{family} {wname}"
    ps = re.sub(r"[^A-Za-z0-9]", "", family) + "-" + wname
    name = font["name"]
    keep = {}
    for nid in (0, 7, 8, 9, 10, 11, 12, 13, 14):
        for args in ((3, 1, 0x409), (1, 0, 0)):
            r = name.getName(nid, *args)
            if r:
                try:
                    keep[nid] = r.toUnicode().strip()
                    break
                except Exception:
                    pass
    name.names = []
    vers = f"{version or 'Version 1.000'}; {BUILD_TAG}"
    values = {**keep, 1: legacy_family, 2: legacy_sub, 3: f"{ps};{BUILD_TAG}", 4: full, 5: vers, 6: ps}
    if not ribbi:
        values[16], values[17] = family, wname
    for nid, val in sorted(values.items()):
        if val:
            name.setName(val, nid, 3, 1, 0x409)
    os2, head = font["OS/2"], font["head"]
    os2.usWeightClass = weight
    sel = os2.fsSelection & ~0b1100001  # clear ITALIC, BOLD, REGULAR
    sel &= ~(1 << 5)
    sel |= (1 << 5) if weight == 700 else 0
    sel |= (1 << 6) if weight == 400 else 0
    sel |= 1 << 7  # USE_TYPO_METRICS
    os2.fsSelection = sel
    head.macStyle = 1 if weight == 700 else 0
    if "CFF " in font:
        top = font["CFF "].cff.topDictIndex[0]
        font["CFF "].cff.fontNames = [ps]
        top.FamilyName, top.FullName = family, full
        top.Weight = wname


def font_version(font: TTFont) -> str | None:
    r = font["name"].getName(5, 3, 1, 0x409) or font["name"].getName(5, 1, 0, 0)
    if not r:
        return None
    v = r.toUnicode().strip()
    return v if v.lower().startswith("version") else f"Version {v}"


def process(path: Path, family: str, weight: int) -> tuple[TTFont, dict]:
    font = TTFont(path, recalcTimestamp=False)
    version = font_version(font)
    cmap = read_cmap(font)
    layout = layout_for(path.name)
    if layout:
        cmap = remap_legacy(font, layout, cmap)
    if 0x20 in cmap and 0xA0 not in cmap:
        cmap[0xA0] = cmap[0x20]
    write_cmap(font, cmap)
    ensure_gdef_marks(font, cmap)
    metrics = fix_vertical_metrics(font, cmap)
    upgrade_os2(font)
    set_names(font, family, weight, version)
    for t in ("DSIG", "LTSH", "hdmx", "VDMX", "PCLT"):
        if t in font:
            del font[t]
    info = {
        "legacyLayout": layout,
        "metrics": metrics,
        "glyphs": font["maxp"].numGlyphs,
        "thaana": sum(1 for cp in cmap if 0x0780 <= cp <= 0x07B1),
        "latin": sum(1 for cp in cmap if cp in ASCII_LETTERS),
        "codepoints": len(cmap),
    }
    return font, info


# ─── Output ──────────────────────────────────────────────────────────────────


def zip_write(zf: zipfile.ZipFile, name: str, data: bytes | str) -> None:
    """Write a zip entry with a fixed timestamp so archives are reproducible."""
    info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
    info.compress_type = zipfile.ZIP_DEFLATED
    info.external_attr = 0o644 << 16
    zf.writestr(info, data)


def save(font: TTFont, path: Path, flavor: str | None = None) -> int:
    font.flavor = flavor
    buf = io.BytesIO()
    font.save(buf)
    path.write_bytes(buf.getvalue())
    font.flavor = None
    return path.stat().st_size


def subset(ttf_bytes: bytes, ranges, path: Path) -> int | None:
    font = TTFont(io.BytesIO(ttf_bytes), recalcTimestamp=False)
    cps = {cp for a, b in ranges for cp in range(a, b + 1)} & set(font.getBestCmap())
    if not cps:
        return None
    opts = Options()
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    opts.name_languages = ["*"]
    opts.notdef_outline = True
    opts.glyph_names = False
    opts.hinting = True
    opts.flavor = "woff2"
    opts.drop_tables = ["DSIG"]
    s = Subsetter(opts)
    s.populate(unicodes=cps)
    s.subset(font)
    font.flavor = "woff2"
    font.save(path)
    return path.stat().st_size


def name_value(font: TTFont, nid: int, any_platform: bool = False) -> str | None:
    r = font["name"].getName(nid, 3, 1, 0x409)
    if not r and any_platform:
        r = font["name"].getName(nid, 1, 0, 0) or next((n for n in font["name"].names if n.nameID == nid), None)
    try:
        return r.toUnicode().strip() if r else None
    except UnicodeDecodeError:
        return None


def load_sources_tsv() -> dict[str, dict]:
    out = {}
    tsv = ROOT / "catalog/sources.tsv"
    for line in tsv.read_text().splitlines():
        group, fname, url, attribution = (line.split("\t") + ["", "", "", ""])[:4]
        out[fname] = {"group": group, "url": url or None, "attribution": attribution}
    return out


def classify_license(text: str | None, override: str | None) -> str:
    """Short license label from the font's own name-table license string."""
    if override:
        return override
    t = (text or "").lower()
    if "open font license" in t or "ofl" in t.split():
        return "OFL-1.1"
    if "creative commons" in t:
        return "CC BY-ND" if "no deriv" in t else "CC BY"
    return "Author's terms" if t else "Unspecified"


def css_metric_overrides(path: Path) -> dict | None:
    """For fonts we may not modify: compute the repaired metrics anyway so the
    site can apply them via @font-face ascent-/descent-/line-gap-override."""
    font = TTFont(path)
    m = fix_vertical_metrics(font, read_cmap(font))
    return m if m["repaired"] else None


def main(only: set[str] | None = None) -> None:
    catalog = tomllib.loads((ROOT / "catalog/families.toml").read_text())
    sources = load_sources_tsv()
    ofl_text = (ROOT / "catalog/OFL.txt").read_text()
    if not only:
        shutil.rmtree(FONTS_OUT, ignore_errors=True)
    FONTS_OUT.mkdir(parents=True, exist_ok=True)
    CATALOG_OUT.parent.mkdir(parents=True, exist_ok=True)
    families = []
    for fid, fam in catalog["families"].items():
        if only and fid not in only:
            continue
        outdir = FONTS_OUT / fid
        shutil.rmtree(outdir, ignore_errors=True)
        outdir.mkdir(parents=True)
        files = sorted(fam["fonts"].items(), key=lambda kv: int(kv[0]))
        first_src = TTFont(SOURCES / files[0][1], lazy=True)
        license_text = name_value(first_src, 13) or name_value(first_src, 13, any_platform=True)
        license = classify_license(license_text, fam.get("license"))
        # Ship byte-for-byte (WOFF/WOFF2 conversion only) when the license forbids
        # derivatives (CC BY-ND) or the designer's terms do (`unmodified = true`).
        unmodified_reason = "license" if license == "CC BY-ND" else "designer" if fam.get("unmodified") else None
        unmodified = unmodified_reason is not None
        styles, zipbuf = [], io.BytesIO()
        meta = {}
        with zipfile.ZipFile(zipbuf, "w", zipfile.ZIP_DEFLATED) as zf:
            for w, fname in files:
                weight = int(w)
                base = f"{fid}-{weight}"
                src_path = SOURCES / fname
                if unmodified:
                    ext = src_path.suffix.lower()
                    shutil.copyfile(src_path, outdir / f"{base}{ext}")
                    font = TTFont(src_path, recalcTimestamp=False)
                    cmap = read_cmap(font)
                    info = {
                        "legacyLayout": None,
                        # Still on Latin keys (a pre-Unicode font we may not remap).
                        "legacyEncoding": layout_for(src_path.name),
                        "metrics": {"repaired": False},
                        "cssOverrides": css_metric_overrides(src_path),
                        "glyphs": font["maxp"].numGlyphs,
                        "thaana": sum(1 for cp in cmap if 0x0780 <= cp <= 0x07B1),
                        "latin": sum(1 for cp in cmap if cp in ASCII_LETTERS),
                        "codepoints": len(cmap),
                        "sizeAdjust": size_adjust(src_path),
                    }
                    sizes = {ext.lstrip("."): (outdir / f"{base}{ext}").stat().st_size}
                    desktop_bytes, desktop_name = src_path.read_bytes(), src_path.name
                else:
                    font, info = process(src_path, fam["name"], weight)
                    info["legacyEncoding"] = None
                    info["cssOverrides"] = None
                    sizes = {"ttf": save(font, outdir / f"{base}.ttf")}
                    info["sizeAdjust"] = size_adjust(outdir / f"{base}.ttf")
                    desktop_bytes = (outdir / f"{base}.ttf").read_bytes()
                    desktop_name = f"{re.sub(r'[^A-Za-z0-9]', '', fam['name'])}-{WEIGHT_NAMES[weight]}.ttf"
                sizes["woff2"] = save(font, outdir / f"{base}.woff2", "woff2")
                sizes["woff"] = save(font, outdir / f"{base}.woff", "woff")
                subsets = {}
                if not unmodified and fam.get("category") != "symbols":
                    for sname, ranges in SUBSETS.items():
                        sz = subset(desktop_bytes, ranges, outdir / f"{base}.{sname}.woff2")
                        if sz:
                            subsets[sname] = sz
                zip_write(zf, f"{fam['name']}/{desktop_name}", desktop_bytes)
                if not meta:
                    meta = {
                        "copyright": name_value(font, 0, True),
                        "designer": name_value(font, 9, True),
                        "manufacturer": name_value(font, 8, True),
                        "description": name_value(font, 10, True),
                        "vendorUrl": name_value(font, 11, True),
                        "designerUrl": name_value(font, 12, True),
                        "licenseText": license_text,
                        "licenseUrl": name_value(font, 14, True),
                        "version": name_value(font, 5, True),
                    }
                src = sources.get(fname, {})
                styles.append(
                    {
                        "weight": weight,
                        "source": fname,
                        "desktopFile": desktop_name,
                        "sizes": sizes,
                        "subsets": subsets,
                        "upstream": src.get("url"),
                        **info,
                    }
                )
            # One scale per family, from the style nearest Regular: measured per
            # weight, heavier strokes read as taller letters and bold would shrink.
            regular = min(styles, key=lambda st: abs(st["weight"] - 400))
            for st in styles:
                st["sizeAdjust"] = regular["sizeAdjust"]
            zip_write(zf, f"{fam['name']}/README.txt", readme(fam, meta, styles, sources, license, unmodified_reason))
            if license == "OFL-1.1":
                zip_write(zf, f"{fam['name']}/OFL.txt", (meta.get("copyright") or "") + "\n\n" + ofl_text)
        (outdir / f"{fid}.zip").write_bytes(zipbuf.getvalue())
        first = sources.get(files[0][1], {})
        families.append(
            {
                "id": fid,
                "name": fam["name"],
                "category": fam["category"],
                "aliases": fam.get("aliases", []),
                "notes": fam.get("notes"),
                "hidden": bool(fam.get("hidden")),
                "license": license,
                "unmodified": unmodified,
                "unmodifiedReason": unmodified_reason,
                "source": first.get("group"),
                "upstream": first.get("url"),
                "attribution": first.get("attribution"),
                **meta,
                # Display text only; the files, README.txt and OFL.txt keep the font's own notice.
                "copyright": fam.get("copyright") or tidy_copyright(meta.get("copyright")),
                "designer": fam.get("designer") or meta.get("designer"),
                "styles": styles,
                "zipSize": len(zipbuf.getvalue()),
            }
        )
        flags = []
        if styles[0]["legacyLayout"]:
            flags.append(f"{styles[0]['legacyLayout']} remap")
        if any(s["metrics"]["repaired"] for s in styles):
            flags.append("metrics repaired")
        if any(s["cssOverrides"] for s in styles):
            flags.append("css metric overrides")
        if unmodified:
            flags.append("unmodified")
        print(f"{fid:28} {len(styles)} style(s)  {license:14}" + "".join(f"  [{f}]" for f in flags))
    if only and CATALOG_OUT.exists():
        old = {f["id"]: f for f in json.loads(CATALOG_OUT.read_text())["families"]}
        old.update({f["id"]: f for f in families})
        families = list(old.values())
    families.sort(key=lambda f: f["name"].lower())
    out = {"subsets": {k: unicode_range_css(v) for k, v in SUBSETS.items()}, "families": families}
    CATALOG_OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1))
    (CATALOG_OUT.parent / "subsets.json").write_text(json.dumps(out["subsets"], indent=1))
    print(f"{len(families)} families, {sum(len(f['styles']) for f in families)} fonts -> {FONTS_OUT}")


def readme(fam, meta, styles, sources, license, unmodified_reason) -> str:
    lines = [fam["name"], "=" * len(fam["name"]), ""]
    if fam.get("notes"):
        lines += [fam["notes"], ""]
    lines.append(f"License: {license}")
    for k, label in (
        ("copyright", "Copyright"),
        ("designer", "Designer"),
        ("manufacturer", "Manufacturer"),
        ("licenseText", "License text"),
        ("licenseUrl", "License URL"),
    ):
        if meta.get(k):
            lines.append(f"{label}: {meta[k]}")
    lines += ["", "Files:"]
    for s in styles:
        src = sources.get(s["source"], {})
        lines.append(
            f"  {s['desktopFile']}  ({WEIGHT_NAMES[s['weight']]} {s['weight']}) <- {s['source']}"
            + (f"  [{src['url']}]" if src.get("url") else "")
        )
    if unmodified_reason:
        why = (
            "This font's license does not allow derivatives"
            if unmodified_reason == "license"
            else "Its designer allows distribution only without changes"
        )
        lines += ["", f"{why}, so it is distributed exactly as published."]
        if any(s["legacyEncoding"] for s in styles):
            lines += [
                "It is a pre-Unicode font with Thaana glyphs on Latin keys: use it to open",
                "documents typed in it. dvfonts.yashau.com/convert turns such text into Unicode.",
            ]
    else:
        if any(s["legacyLayout"] for s in styles):
            lines += [
                "",
                "This font was originally a pre-Unicode font with Thaana glyphs on Latin keys.",
                "dvfonts remapped it to Unicode Thaana (U+0780-U+07BF), so it works with any",
                "standard Dhivehi keyboard and on the web.",
            ]
        lines += [
            "",
            "Cleaned and repackaged by dvfonts: Unicode cmap, repaired vertical metrics,",
            "normalised names and weights. Glyph outlines are unchanged.",
        ]
    lines += ["If you hold rights to this font and want it changed or removed, open an issue."]
    return "\n".join(lines) + "\n"


if __name__ == "__main__":
    main(set(sys.argv[1:]) or None)
