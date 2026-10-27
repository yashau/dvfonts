"""Which source fonts use a legacy ASCII-slot encoding, and which layout."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from layouts import LAYOUTS

PHONETIC_FONTS = {
    "ajumalu.ttf",
    "akko.ttf",
    "akuro2w2.ttf",
    "akuru.ttf",
    "athu-casual.otf",
    "avas-thaana.otf",
    "bodukuru-light.otf",
    "faiy-light.otf",
    "nasr-light.otf",
    "nayaa-light.ttf",
    "nooru-light.ttf",
    "novel03-bold.ttf",
    "samee-avas-thaana.ttf",
    "sehga-casual.ttf",
    "thaana-bold.ttf",
    "thaana.ttf",
}
TYPEWRITER_FONTS = {
    "a-haleem-bolhu-bold.otf",
    "a-haleem-faseyha.otf",
    "a-haleem-kb.otf",
    "a-haleem-kirudhooni.otf",
    "a-haleem-mathi-bold.otf",
    "a-haleem-raaveri.otf",
    "a-haleem-riveli.otf",
    "a-haleem-sh-bold-italic.otf",
    "a-haleem-thangi-bold.otf",
    "a-haleem-thiki-bold.otf",
    "a-haleem-uivashaa.otf",
    "a-ilham.ttf",
    "a-kaani.otf",
    "a-koagannu.ttf",
    "a-lakudi-college.otf",
    "a-lakudi.otf",
    "a-midhili.otf",
    "a-uni.otf",
    "a-waheed-college.otf",
    "a-waheed.otf",
    "aammu-f-rasmy.ttf",
    "aammu-f-thedhu.ttf",
    "aammu-h-thedhu.ttf",
    "faseyha.otf",
    "faseyha.ttf",
    "ilham.ttf",
    "raadhavalhi-b.ttf",
    "randhoo.ttf",
    "utheem.otf",
    "utheem.ttf",
    "waheed.ttf",
}


def layout_for(fname):
    if fname in PHONETIC_FONTS:
        return "phonetic"
    if fname in TYPEWRITER_FONTS:
        return "typewriter"
    return None


def unicode_to_ascii(fname):
    """Unicode char -> ASCII char for a legacy font (None for Unicode fonts)."""
    lay = layout_for(fname)
    if not lay:
        return None
    inv = {}
    for k, v in LAYOUTS[lay].items():
        inv.setdefault(v, k)
    return inv
