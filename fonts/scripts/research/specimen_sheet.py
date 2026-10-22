"""Quick specimen sheet of many fonts (legacy ones rendered through their layout)."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # fonts/scripts
from legacy import unicode_to_ascii

ROOT = Path(__file__).resolve().parents[2]  # fonts/
TEXT = "ދިވެހިރާއްޖޭގެ ޤައުމީ ބަހަކީ ދިވެހި"
out = sys.argv[1]
files = sys.argv[2:]
css = "".join(f"@font-face{{font-family:f{i};src:url('file://{ROOT}/sources/{f}')}}" for i, f in enumerate(files))
rows = ""
for i, f in enumerate(files):
    inv = unicode_to_ascii(f)
    if inv:  # legacy: visual-order LTR string
        t = "".join(inv.get(c, c) for c in reversed(TEXT))
        d = "ltr"
    else:
        t = TEXT
        d = "rtl"
    rows += (
        f"<div class=r><span class=n>{f}</span><span class=s style='font-family:f{i};direction:{d}'>{t}</span></div>"
    )
Path(out).write_text(f"""<html><meta charset=utf-8><style>{css}
body{{margin:6px;width:1180px}} .r{{display:flex;align-items:center;border-bottom:1px solid #ddd;height:62px;overflow:hidden}}
.n{{font:12px monospace;width:250px;flex:none}} .s{{font-size:30px;line-height:62px;white-space:nowrap;flex:1;text-align:right;unicode-bidi:bidi-override}}</style><body>{rows}</body></html>""")
