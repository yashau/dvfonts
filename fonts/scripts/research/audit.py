"""Dump metadata + health checks for every font in sources/ to audit.json."""

import hashlib
import json
from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]  # fonts/
THAANA = set(range(0x0780, 0x07B2))


def name(f, nid):
    n = f["name"]
    for args in ((3, 1, 0x409), (1, 0, 0)):
        r = n.getName(nid, *args)
        if r:
            try:
                return str(r).strip()
            except Exception:
                pass
    for r in n.names:
        if r.nameID == nid:
            try:
                return r.toUnicode().strip()
            except Exception:
                pass
    return None


out = []
for p in sorted((ROOT / "sources").iterdir()):
    rec = {"file": p.name, "size": p.stat().st_size, "sha1": hashlib.sha1(p.read_bytes()).hexdigest()}
    try:
        f = TTFont(p, lazy=True)
        cmap = f.getBestCmap() or {}
        cps = set(cmap)
        os2 = f["OS/2"] if "OS/2" in f else None
        hhea = f["hhea"]
        head = f["head"]
        rec.update(
            family=name(f, 1),
            sub=name(f, 2),
            full=name(f, 4),
            ps=name(f, 6),
            tfam=name(f, 16),
            tsub=name(f, 17),
            version=name(f, 5),
            copyright=name(f, 0),
            designer=name(f, 9),
            vendorurl=name(f, 11),
            designerurl=name(f, 12),
            license=name(f, 13),
            licenseurl=name(f, 14),
            manufacturer=name(f, 8),
            description=name(f, 10),
            upm=head.unitsPerEm,
            glyphs=f["maxp"].numGlyphs,
            outlines="CFF" if "CFF " in f else ("CFF2" if "CFF2" in f else "TT"),
            weight=os2.usWeightClass if os2 else None,
            fsType=os2.fsType if os2 else None,
            fsSelection=os2.fsSelection if os2 else None,
            macStyle=head.macStyle,
            vendor=os2.achVendID if os2 else None,
            typo=(os2.sTypoAscender, os2.sTypoDescender, os2.sTypoLineGap) if os2 else None,
            win=(os2.usWinAscent, os2.usWinDescent) if os2 else None,
            hhea=(hhea.ascent, hhea.descent, hhea.lineGap),
            bbox=(head.yMin, head.yMax),
            thaana=len(cps & THAANA),
            latin=len(cps & set(range(0x41, 0x7B))),
            pua=len([c for c in cps if 0xE000 <= c <= 0xF8FF]),
            arabic=len([c for c in cps if 0x0600 <= c <= 0x06FF]),
            cmapsubs=sorted({(t.platformID, t.platEncID) for t in f["cmap"].tables}),
            tables=sorted(f.keys()),
            gsub="GSUB" in f,
            gpos="GPOS" in f,
            kern="kern" in f,
        )
    except Exception as e:
        rec["error"] = repr(e)
    out.append(rec)

(ROOT / "build").mkdir(exist_ok=True)
(ROOT / "build/audit.json").write_text(json.dumps(out, indent=1, ensure_ascii=False))
print(len(out))
