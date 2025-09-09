#!/usr/bin/env bash
set -euo pipefail

# Run Flask dev server with auto-reload for backend
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../backend"

# Ensure venv exists
if [[ ! -d .venv ]]; then
  echo "[backend] Creating virtualenv..."
  python3 -m venv .venv
fi

# Ensure deps are present (no-op if already installed)
.venv/bin/python -m pip install --upgrade pip >/dev/null 2>&1 || true
if [[ -f requirements.txt ]]; then
  .venv/bin/pip install -r requirements.txt >/dev/null 2>&1 || true
fi

echo "[backend] Starting Flask dev server with reload..."
exec .venv/bin/python -m flask --app app run --debug --host 0.0.0.0 --port 5000

