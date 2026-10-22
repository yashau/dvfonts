"""Tidy a font's copyright notice (name ID 0) for display on the site.

Only the catalog's display text goes through this. Font files, OFL.txt and the
README in each zip keep the notice exactly as the font has it.
"""

import re

# Notices that are font-editor boilerplate, not a copyright.
_NOT_A_NOTICE = re.compile(r"^(generated (in \d{4} )?by (fontlab|fontographer)|copyright info pending)", re.I)

# Leftovers that only add noise: rights boilerplate and 1990s phone numbers.
_NOISE = [
    re.compile(r"\ball rights reserved\b\.?", re.I),
    re.compile(r"\b(tel|phone)\s*:?\s*\d[\d ]{4,}\d\.?", re.I),
    re.compile(r"\bfor comments contact\s*:?\s*\d+\.?", re.I),
    re.compile(r"\bhelping you to communicate better\.?", re.I),
]

# "Copyright (C)", "(C) Copyright,", "CopyRight (c)", "Copyright" -> "©".
_MARK = re.compile(r"(\(c\)\s*copyright,?|copyright\s*(\(c\)|©)|\(c\)|copyright(?=\s+(\d|[A-Z])))", re.I)


def tidy_copyright(text: str | None) -> str | None:
    if not text:
        return None
    s = " ".join(text.split())
    if _NOT_A_NOTICE.match(s):
        return None
    for pat in _NOISE:
        s = pat.sub("", s)
    # Contact details and license sentences (the license has its own row).
    s = re.sub(r"\s*<[^<>@\s]+@[^<>\s]+>", "", s)
    s = re.sub(r"\s*\(email:[^)]*\)", "", s, flags=re.I)
    s = re.sub(r"\s*\blicensed under\b.*$", "", s, flags=re.I)
    # A dangling, unclosed quote fragment after a line break: "Copyright Zillon 2018\n“MV Thaanarabi".
    s = re.sub(r"\s*“[^”]*$", "", s)
    s = _MARK.sub("©", s)
    # "1998 © Name" -> "© 1998 Name"
    s = re.sub(r"^(\d{4}) ©", r"© \1", s)
    s = re.sub(r"©\s*,?\s*", "© ", s)
    # "© 2021 by Hussain Niyaz" -> "© 2021 Hussain Niyaz"
    s = re.sub(r"(© \d{4}(?:[-–]\d{2,4})?),? (?:by )?", r"\1 ", s)
    # Punctuation spacing: no space before , . and one after a comma.
    s = re.sub(r"\s+([,.])", r"\1", s)
    s = re.sub(r",(?=\S)", ", ", s)
    # A full stop glued to the next sentence ("Mazeed.Phone"), not initials ("M.A.Gadir") or domains.
    s = re.sub(r"(?<=[a-z]{2})\.(?=[A-Z][a-z])", ". ", s)
    # Initials run into a surname: "M.A.Gadir" -> "M.A. Gadir".
    s = re.sub(r"\b((?:[A-Z]\.){1,3})(?=[A-Z][a-z])", r"\1 ", s)
    # Credits continued after a comma read as one sentence: ", Created by" -> ", created by".
    s = re.sub(r", (Created|Assisted|Calligraphy|Designed|Modified)\b", lambda m: ", " + m[1].lower(), s)
    s = re.sub(r"\s{2,}", " ", s).strip(" ,")
    s = re.sub(r"(\.\s*){2,}", ". ", s).strip()
    if not s or s == "©" or re.fullmatch(r"©\s*\d{4}\.?", s):
        return None
    return s
