#!/bin/bash
set -eu
ROOT="$(cd "$(dirname "$0")" && pwd)"
SOURCE="$ROOT/../extension"
DEST="$HOME/Library/Application Support/Adobe/CEP/extensions/com.theo.engine"

printf '\nTheoEngine macOS file-copy installer\n\n'
printf 'This copies only the extension files. No system settings or user data are changed.\n\n'
if [ ! -f "$SOURCE/index.html" ] || [ ! -f "$SOURCE/CSXS/manifest.xml" ]; then
  printf 'Error: extension folder is missing. Keep this script beside the extension folder.\n'
  exit 1
fi
mkdir -p "$DEST"
 ditto "$SOURCE" "$DEST"
printf '\nTheoEngine files copied to:\n%s\n' "$DEST"
printf 'Restart After Effects and follow docs/INSTALL.txt if CEP support still needs manual configuration.\n'
