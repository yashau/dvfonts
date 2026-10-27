// One-line installers for the desktop bundles, served at /install/<bundle>.sh and
// /install/<bundle>.ps1. Both install for the current user only (no sudo, no admin),
// check the zip's SHA-256 first, and put each family in fonts.mv/<Family>/, so
// installing a second bundle overwrites the same files instead of duplicating them.
import bundles from '#lib/data/bundles.json';
import { SITE_ORIGIN } from '#lib/site.js';

export type Bundle = (typeof bundles)[number];

/** Bundles that can be installed: desktop TTF/OTF collections. The webfont kits aren't
 *  for installing, and the legacy fonts share file names with the remapped families. */
export const INSTALLABLE: Bundle[] = bundles.filter((b) => b.format === 'ttf');

export type Shell = 'sh' | 'ps1';

export function installCommand(bundle: Bundle, shell: Shell): string {
	const url = `${SITE_ORIGIN}/install/${bundle.id}.${shell}`;
	return shell === 'sh' ? `curl -fsSL ${url} | sh` : `irm ${url} | iex`;
}

/** POSIX sh, for macOS and Linux. */
export function shScript(b: Bundle): string {
	return `#!/bin/sh
# fonts.mv: install the ${b.name} bundle (${b.families} families) for the current user.
# macOS: ~/Library/Fonts/fonts.mv   Linux: ~/.local/share/fonts/fonts.mv
# Usage: curl -fsSL ${SITE_ORIGIN}/install/${b.id}.sh | sh
set -eu

file='${b.file}'
sha256='${b.sha256}'
base="\${FONTS_MV_URL:-${SITE_ORIGIN}}"

case "$(uname -s)" in
	Darwin) dest="$HOME/Library/Fonts/fonts.mv" ;;
	*) dest="\${XDG_DATA_HOME:-$HOME/.local/share}/fonts/fonts.mv" ;;
esac

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "Downloading ${b.name} (${b.families} families)..."
curl -fsSL "$base/downloads/$file" -o "$tmp/$file"

if command -v sha256sum >/dev/null 2>&1; then
	got="$(sha256sum "$tmp/$file" | cut -d' ' -f1)"
else
	got="$(shasum -a 256 "$tmp/$file" | cut -d' ' -f1)"
fi
if [ "$got" != "$sha256" ]; then
	echo "The download doesn't match its checksum; nothing was installed." >&2
	exit 1
fi

mkdir "$tmp/x"
if command -v unzip >/dev/null 2>&1; then
	unzip -q "$tmp/$file" -d "$tmp/x"
elif command -v bsdtar >/dev/null 2>&1; then
	bsdtar -xf "$tmp/$file" -C "$tmp/x"
elif command -v python3 >/dev/null 2>&1; then
	python3 -m zipfile -e "$tmp/$file" "$tmp/x"
else
	echo "Need unzip, bsdtar or python3 to unpack the zip." >&2
	exit 1
fi

# The zip holds <bundle>/<Family>/<files>: fonts plus each family's README and license.
n=0
for dir in "$tmp"/x/*/*/; do
	family="$(basename "$dir")"
	mkdir -p "$dest/$family"
	for f in "$dir"*; do
		[ -f "$f" ] || continue
		cp "$f" "$dest/$family/"
		case "$f" in *.ttf | *.otf | *.TTF | *.OTF) n=$((n + 1)) ;; esac
	done
done

if command -v fc-cache >/dev/null 2>&1; then
	fc-cache -f "$dest" >/dev/null 2>&1 || true
fi

echo "Installed $n fonts in $dest"
`;
}

/** PowerShell 5.1 (Windows) or 7+ (Windows, macOS, Linux). Runs in its own scope, so
 *  piping it to iex leaves no variables or preference changes behind. */
export function ps1Script(b: Bundle): string {
	return `# fonts.mv: install the ${b.name} bundle (${b.families} families) for the current user.
# Windows: %LOCALAPPDATA%\\Microsoft\\Windows\\Fonts\\fonts.mv (no admin needed)
# macOS: ~/Library/Fonts/fonts.mv   Linux: ~/.local/share/fonts/fonts.mv
# Usage: irm ${SITE_ORIGIN}/install/${b.id}.ps1 | iex
& {
	$ErrorActionPreference = 'Stop'
	$ProgressPreference = 'SilentlyContinue'

	$file = '${b.file}'
	$sha256 = '${b.sha256}'
	$base = if ($env:FONTS_MV_URL) { $env:FONTS_MV_URL } else { '${SITE_ORIGIN}' }

	$onWindows = $PSVersionTable.PSEdition -eq 'Desktop' -or $IsWindows
	if ($onWindows) {
		$dest = Join-Path $env:LOCALAPPDATA 'Microsoft\\Windows\\Fonts\\fonts.mv'
	} elseif ($IsMacOS) {
		$dest = Join-Path $HOME 'Library/Fonts/fonts.mv'
	} else {
		$data = if ($env:XDG_DATA_HOME) { $env:XDG_DATA_HOME } else { Join-Path $HOME '.local/share' }
		$dest = Join-Path $data 'fonts/fonts.mv'
	}

	$tmp = Join-Path ([IO.Path]::GetTempPath()) ('fonts-mv-' + [guid]::NewGuid())
	New-Item -ItemType Directory -Path $tmp | Out-Null
	try {
		Write-Host 'Downloading ${b.name} (${b.families} families)...'
		$zip = Join-Path $tmp $file
		Invoke-WebRequest -UseBasicParsing -Uri "$base/downloads/$file" -OutFile $zip
		if ((Get-FileHash -Algorithm SHA256 -Path $zip).Hash.ToLower() -ne $sha256) {
			throw "The download doesn't match its checksum; nothing was installed."
		}
		$unpacked = Join-Path $tmp 'x'
		Expand-Archive -Path $zip -DestinationPath $unpacked

		if ($onWindows) {
			# Per-user fonts are registered under HKCU; AddFontResource makes them usable
			# in this session without signing out.
			$reg = 'HKCU:\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Fonts'
			if (-not (Test-Path $reg)) { New-Item -Path $reg -Force | Out-Null }
			if (-not ('FontsMv.Gdi' -as [type])) {
				Add-Type -Namespace FontsMv -Name Gdi -MemberDefinition @'
[DllImport("gdi32.dll", CharSet = CharSet.Unicode)] public static extern int AddFontResource(string file);
[DllImport("user32.dll")] public static extern System.IntPtr SendMessageTimeout(System.IntPtr hWnd, uint msg, System.UIntPtr wParam, System.IntPtr lParam, uint flags, uint timeout, out System.UIntPtr result);
'@
			}
		}

		# The zip holds <bundle>/<Family>/<files>: fonts plus each family's README and license.
		$n = 0
		foreach ($family in Get-ChildItem -Path (Get-ChildItem -Path $unpacked -Directory)[0].FullName -Directory) {
			$to = Join-Path $dest $family.Name
			New-Item -ItemType Directory -Force -Path $to | Out-Null
			foreach ($f in Get-ChildItem -Path $family.FullName -File) {
				$target = Join-Path $to $f.Name
				try {
					Copy-Item -Path $f.FullName -Destination $target -Force
				} catch {
					# A font that's already installed and in use can't be overwritten; it's the same file.
					Write-Warning "Skipped $($f.Name): $($_.Exception.Message)"
				}
				if ($f.Extension -in '.ttf', '.otf') {
					$n++
					if ($onWindows) {
						$kind = if ($f.Extension -eq '.otf') { 'OpenType' } else { 'TrueType' }
						New-ItemProperty -Path $reg -Name "$($family.Name) $($f.BaseName) ($kind)" -Value $target -PropertyType String -Force | Out-Null
						[void][FontsMv.Gdi]::AddFontResource($target)
					}
				}
			}
		}

		if ($onWindows) {
			$result = [UIntPtr]::Zero
			[void][FontsMv.Gdi]::SendMessageTimeout([IntPtr]0xffff, 0x001D, [UIntPtr]::Zero, [IntPtr]::Zero, 2, 1000, [ref]$result)
		} elseif (Get-Command fc-cache -ErrorAction SilentlyContinue) {
			fc-cache -f $dest | Out-Null
		}

		Write-Host "Installed $n fonts in $dest"
	} finally {
		Remove-Item -Recurse -Force -Path $tmp -ErrorAction SilentlyContinue
	}
}
`;
}
