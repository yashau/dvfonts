"""Exact contour matching between a legacy font and a Unicode twin sharing outlines."""

import sys
from pathlib import Path

import numpy as np
from fontTools.pens.basePen import BasePen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]  # fonts/


class PtsPen(BasePen):
    def __init__(s, gs):
        super().__init__(gs)
        s.c = []
        s.cur = []

    def _moveTo(s, p):
        s.cur = [p]

    def _lineTo(s, p):
        s.cur.append(p)

    def _curveToOne(s, a, b, c):
        s.cur += [a, b, c]

    def _qCurveToOne(s, a, b):
        s.cur += [a, b]

    def _closePath(s):
        s.c.append(s.cur)
        s.cur = []

    _endPath = _closePath


def sig(font, gname):
    gs = font.getGlyphSet()
    p = PtsPen(gs)
    gs[gname].draw(p)
    upm = font["head"].unitsPerEm
    if not p.c:
        return None
    # per-contour: centroid & ink extent, sorted; normalised to em
    feats = sorted(
        (round(np.mean([q[0] for q in c]) / upm, 3), round(np.mean([q[1] for q in c]) / upm, 3), len(c)) for c in p.c
    )
    a = np.array([(x, y) for x, y, _ in feats])
    a[:, 0] -= a[:, 0].min()
    return a


def dist(a, b):
    if a is None or b is None or len(a) != len(b):
        return 9
    return float(np.abs(a - b).mean())


L = TTFont(ROOT / "sources" / sys.argv[1])
U = TTFont(ROOT / "sources" / sys.argv[2])
lc, uc = L.getBestCmap(), U.getBestCmap()
targets = [cp for cp in list(range(0x0780, 0x07B2)) + [0x060C, 0x061B, 0x061F, 0xFDF2, 0xF7, 0xD7] if cp in uc]
US = {cp: sig(U, uc[cp]) for cp in targets}
for c in range(33, 127):
    if c not in lc:
        continue
    s = sig(L, lc[c])
    best = sorted((dist(s, US[cp]), cp) for cp in targets)[:2]
    (d1, c1), (d2, c2) = best
    print(f"{chr(c)} -> U+{c1:04X} {chr(c1)} d={d1:.3f}  (2nd {chr(c2)} {d2:.3f}){'  ??' if d1 > 0.02 else ''}")
