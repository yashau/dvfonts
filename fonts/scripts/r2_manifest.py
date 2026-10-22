"""Write fonts/build/r2-bulk.json: the key/file list for `wrangler r2 bulk put`.

Everything under fonts/build/r2/ (fonts/<id>/… from build.py, downloads/… from
bundles.py) is uploaded with its path as the object key, so the Worker can
serve /fonts/<id>/<file> and /downloads/<file> straight from the bucket.
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent  # fonts/
BASE = ROOT / "build" / "r2"


def main() -> None:
    entries = [{"key": p.relative_to(BASE).as_posix(), "file": str(p)} for p in sorted(BASE.rglob("*")) if p.is_file()]
    out = ROOT / "build" / "r2-bulk.json"
    out.write_text(json.dumps(entries))
    size = sum(Path(e["file"]).stat().st_size for e in entries)
    print(f"{len(entries)} objects, {size / 1e6:.1f} MB -> {out}")


if __name__ == "__main__":
    main()
