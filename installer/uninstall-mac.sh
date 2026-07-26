#!/bin/bash
set -eu
DEST="$HOME/Library/Application Support/Adobe/CEP/extensions/com.theo.engine"
printf '\nTheoEngine macOS file-only uninstaller\n\n'
printf 'This removes only:\n%s\n' "$DEST"
printf 'Browser cookies, localStorage, presets, and project files are not touched.\n\n'
read -r -p 'Remove TheoEngine extension files? [y/N] ' answer
case "$answer" in
  y|Y|yes|YES) ;;
  *) printf 'Cancelled.\n'; exit 0 ;;
esac
if [ ! -e "$DEST" ]; then
  printf 'TheoEngine is not installed at that location.\n'
  exit 0
fi
rm -rf "$DEST"
printf 'TheoEngine extension files removed.\n'
