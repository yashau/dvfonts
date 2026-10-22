#!/bin/sh
# shot.sh <html> <png> [WxH] — screenshot a local HTML file with headless Chromium.
# Set CHROME to a Chromium/Chrome binary (e.g. Playwright's chrome-headless-shell).
exec "${CHROME:?set CHROME to a Chromium binary}" --no-sandbox --allow-file-access-from-files --hide-scrollbars --screenshot="$2" --window-size="${3:-1900,1200}" "file://$(realpath "$1")" >/dev/null 2>&1
