import sys

NATIVE = [chr(c) for c in range(0x0780, 0x0798)]
ARABIC = [chr(c) for c in range(0x0798, 0x07A6)]
FILI = [chr(c) for c in range(0x07A6, 0x07B1)]
for s in sys.argv[1:]:
    print(s)
    for name, group in (("native", NATIVE), ("arabic", ARABIC), ("fili", FILI)):
        miss = [c for c in group if c not in s]
        print(f"  {name}: missing {len(miss)}/{len(group)} {' '.join(miss)}")
