import sys

sys.path.insert(0, str(__import__("pathlib").Path(__file__).resolve().parent))
import exact_match_lib as em
import match_layout as ml
from fontTools.ttLib import TTFont

ml.PX = 128
ml.CAN = (256, 300)
ml.BASE = 166
_blur = ml.blur
ml.blur = lambda a, r=1: _blur(a, 1)
leg, twin = sys.argv[1], sys.argv[2]
L = TTFont(em.ROOT / "sources" / leg)
U = TTFont(em.ROOT / "sources" / twin)
lc, uc = L.getBestCmap(), U.getBestCmap()
LF, UF = ml.face(leg), ml.face(twin)
targets = [cp for cp in ml.TARGETS if cp in uc]
UR = {cp: ml.raster(UF, cp) for cp in targets}
UN = {cp: (lambda s: len(s) if s is not None else 0)(em.sig(U, uc[cp])) for cp in targets}
for c in list(range(0x21, 0x7F)):
    if c not in lc:
        continue
    r = ml.raster(LF, c)
    s = em.sig(L, lc[c])
    n = len(s) if s is not None else 0
    if r is None:
        continue
    sc = sorted(
        ((ml.score(r, UR[cp]) - (0 if UN[cp] == n else 0.3), cp) for cp in targets if UR[cp] is not None), reverse=True
    )[:2]
    (s1, c1), (s2, c2) = sc
    print(f"{chr(c)} U+{c1:04X} {chr(c1)} {s1:.2f} | {chr(c2)} {s2:.2f}{'  ??' if s1 < 0.8 or s1 - s2 < 0.05 else ''}")
