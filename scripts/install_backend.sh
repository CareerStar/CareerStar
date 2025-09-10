#!/usr/bin/env bash
set -euo pipefail

# Always run from repo root; cd into backend
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../backend"

echo "[backend] Ensuring virtualenv exists..."
if [[ ! -d .venv ]]; then
  python3 -m venv .venv
fi

source .venv/bin/activate

echo "[backend] Installing Python dependencies..."
# Use the venv's pip explicitly; upgrade base tooling, then install deps
.venv/bin/python -m pip install --upgrade pip setuptools wheel
.venv/bin/pip install -r requirements.txt

echo "[backend] Dependencies installed. Venv: $(pwd)/.venv"

