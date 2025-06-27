#!/bin/bash
# Usage: ./start-backend.sh
# This script sets up and runs the FastAPI backend from the repo root.

set -e
cd "$(dirname "$0")/backend"

# Create venv if it doesn't exist
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

# Activate venv
source .venv/bin/activate

# Install requirements
pip install --upgrade pip
pip install -r requirements.txt

# Start the FastAPI server
exec uvicorn main:app --reload
