"""Build the download bundles defined in catalog/bundles.toml.

Reads the built library (fonts/build/r2/fonts + catalog.json, so run
scripts/build.py first) and writes deterministic zips to fonts/build/r2/downloads/,
plus apps/web/src/lib/data/bundles.json describing them for the site. Everything
under fonts/build/r2/ is uploaded to R2 and served at /fonts/… and /downloads/….
"""

from __future__ import annotations

import hashlib
import json
import tomllib
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent  # fonts/
WEB = ROOT.parent / "apps" / "web"
FONTS = ROOT / "build" / "r2" / "fonts"
CATALOG = WEB / "src" / "lib" / "data" / "catalog.json"
MANIFEST = WEB / "src" / "lib" / "data" / "bundles.json"
OUT = ROOT / "build" / "r2" / "downloads"

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


def zip_write(zf: zipfile.ZipFile, name: str, data: bytes | str) -> None:
    info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
    info.compress_type = zipfile.ZIP_DEFLATED
    info.external_attr = 0o644 << 16
    zf.writestr(info, data)


def select(spec: dict, families: list[dict]) -> list[dict]:
    chosen = families
    if ids := spec.get("families"):
        by_id = {f["id"]: f for f in families}
        missing = [i for i in ids if i not in by_id]
        if missing:
            raise SystemExit(f"bundle references unknown families: {missing}")
        chosen = [by_id[i] for i in ids]
    if cats := spec.get("categories"):
        chosen = [f for f in chosen if f["category"] in cats]
    if lic := spec.get("licenses"):
        chosen = [f for f in chosen if f["license"] in lic]
    if spec.get("legacy") is False:
        chosen = [f for f in chosen if not any(s["legacyLayout"] for s in f["styles"])]
    return sorted(chosen, key=lambda f: f["name"].lower())


def family_readme(fid: str) -> dict[str, bytes]:
    """The README.txt (and OFL.txt) that build.py put in the family zip."""
    with zipfile.ZipFile(FONTS / fid / f"{fid}.zip") as zf:
        return {Path(n).name: zf.read(n) for n in zf.namelist() if n.endswith(".txt")}


def css_for(fams: list[dict]) -> str:
    rules = []
    for f in fams:
        for s in f["styles"]:
            rules.append(
                "@font-face {\n"
                f"  font-family: '{f['name']}';\n"
                "  font-style: normal;\n"
                f"  font-weight: {s['weight']};\n"
                "  font-display: swap;\n"
                f"  src: url('./{f['id']}/{f['id']}-{s['weight']}.woff2') format('woff2');\n"
                "}"
            )
    return (
        "/* Self-hosted Dhivehi fonts from dvfonts. Use with a Latin fallback:\n"
        "   font-family: 'Faruma', system-ui, 'Noto Sans Thaana', 'MV Boli', sans-serif; */\n\n"
        + "\n\n".join(rules)
        + "\n"
    )


def build_bundle(bid: str, spec: dict, families: list[dict]) -> dict:
    fams = select(spec, families)
    fmt = spec.get("format", "ttf")
    top = f"dvfonts-{bid}"
    path = OUT / f"{top}.zip"
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in fams:
            for s in f["styles"]:
                if fmt == "woff2":
                    src = FONTS / f["id"] / f"{f['id']}-{s['weight']}.woff2"
                    zip_write(zf, f"{top}/{f['id']}/{src.name}", src.read_bytes())
                else:
                    ext = "otf" if "otf" in s["sizes"] else "ttf"
                    src = FONTS / f["id"] / f"{f['id']}-{s['weight']}.{ext}"
                    zip_write(zf, f"{top}/{f['name']}/{s['desktopFile']}", src.read_bytes())
            folder = f["id"] if fmt == "woff2" else f["name"]
            for name, data in family_readme(f["id"]).items():
                zip_write(zf, f"{top}/{folder}/{name}", data)
        if fmt == "woff2":
            zip_write(zf, f"{top}/fonts.css", css_for(fams))
        listing = "\n".join(f"  {f['name']}  ({len(f['styles'])} styles, {f['license']})" for f in fams)
        zip_write(
            zf,
            f"{top}/README.txt",
            f"dvfonts — {spec['name']}\n\n{spec['description']}\n\n{len(fams)} families:\n{listing}\n\n"
            "Each family folder has a README with its credits and license. Licenses differ per\n"
            "family; check them before redistributing. https://dvfonts.yashau.com\n",
        )
    data = path.read_bytes()
    return {
        "id": bid,
        "name": spec["name"],
        "description": spec["description"],
        "format": fmt,
        "file": path.name,
        "families": len(fams),
        "styles": sum(len(f["styles"]) for f in fams),
        "size": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


def main() -> None:
    bundles = tomllib.loads((ROOT / "catalog" / "bundles.toml").read_text())["bundles"]
    families = json.loads(CATALOG.read_text())["families"]
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = [build_bundle(bid, spec, families) for bid, spec in bundles.items()]
    MANIFEST.write_text(json.dumps(manifest, indent=1) + "\n")
    for b in manifest:
        print(f"{b['file']:42} {b['families']:4} families {b['size'] / 1e6:7.1f} MB")


if __name__ == "__main__":
    main()
