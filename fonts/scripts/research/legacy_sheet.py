"""Contact sheets: legacy fonts rendered through a layout vs Faruma reference."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # fonts/scripts
from layouts import LAYOUTS

ROOT = Path(__file__).resolve().parents[2]  # fonts/
layout = LAYOUTS[sys.argv[1]]
files = sys.argv[2:]
inv = {}
for k, v in layout.items():
    inv.setdefault(v, k)
order = [chr(c) for c in range(0x0780, 0x07A6)] + ["ﷲ", "،", "؛", "؟"] + [chr(c) for c in range(0x07A6, 0x07B1)]
css = "".join(f"@font-face{{font-family:'f{i}';src:url('file://{ROOT}/sources/{f}')}}" for i, f in enumerate(files))
css += f"@font-face{{font-family:'ref';src:url('file://{ROOT}/sources/faruma.ttf')}}"


def cell(u, i):
    k = inv.get(u)
    if k is None:
        return "<td>-</td>"
    mark = 0x07A6 <= ord(u) <= 0x07B0
    ref = ("ބ" + u) if mark else u
    leg = (inv["ބ"] + k) if mark else k
    return f'<td><div class=r>{ref}</div><div class=l style="font-family:f{i}">{leg}</div><div class=k>{k}</div></td>'


rows = [f"<tr><th>{f}</th>{''.join(cell(u, i) for u in order)}</tr>" for i, f in enumerate(files)]
Path(ROOT / "build/sheet.html").write_text(f"""<html><head><meta charset=utf-8><style>{css}
body{{margin:4px;background:#fff}} td,th{{border:1px solid #ccc;text-align:center;padding:0 1px}} th{{font:11px sans-serif;width:90px;word-break:break-all}}
.r{{font:24px ref;direction:rtl;color:#1a5;height:36px}} .l{{font-size:30px;height:46px;line-height:46px;white-space:pre}} .k{{font:9px monospace;color:#999}}
table{{border-collapse:collapse}}</style></head><body><table>{"".join(rows)}</table></body></html>""")
