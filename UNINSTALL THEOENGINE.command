#!/bin/bash
set -eu
ROOT="$(cd "$(dirname "$0")" && pwd)"
exec "$ROOT/installer/uninstall-mac.sh"
