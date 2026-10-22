"""Classify legacy ASCII-slot Thaana fonts as typewriter vs phonetic layout.

In the typewriter layout 'w' is abafili (a mark above the line) and 'a' is alifu;
the phonetic layout swaps them. So compare where the ink of 'a' and 'w' sits."""

import json
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]  # fonts/


def ymin(font, ch):
    cm = font.getBestCmap()
    g = cm.get(ord(ch))
    if not g:
        return None
    gs = font.getGlyphSet()
    bp = BoundsPen(gs)
    gs[g].draw(bp)
    return bp.bounds[1] / font["head"].unitsPerEm if bp.bounds else None


def detect(path):
    f = TTFont(path)
    a, w = ymin(f, "a"), ymin(f, "w")
    if a is None or w is None:
        return None, (a, w)
    if w > 0.25 and a < 0.15:
        return "typewriter", (a, w)
    if a > 0.25 and w < 0.15:
        return "phonetic", (a, w)
    return None, (a, w)


if __name__ == "__main__":
    audit = json.load(open(ROOT / "build/audit.json"))
    for r in audit:
        if r["thaana"] == 0:
            lay, v = detect(ROOT / "sources" / r["file"])
            print(f"{r['file']:28} {lay}  a={v[0] and round(v[0], 2)} w={v[1] and round(v[1], 2)}")
