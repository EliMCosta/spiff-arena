#!/usr/bin/env bash

set -o errtrace -o errexit -o nounset -o pipefail
trap 'error_handler ${LINENO} $?' ERR

# Source common utilities
script_dir="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
source "${script_dir}/common.sh"

# Parse command line arguments
SERVICE=""
if [[ $# -gt 0 ]]; then
  SERVICE=$1
fi

# Stop any running services first
./bin/stop.sh

# Ensure process_models directory has correct permissions
ensure_process_models_permissions

# Ensure frontend dependencies are installed
if [[ -z "$SERVICE" || "$SERVICE" == "spiffworkflow-frontend" ]]; then
  echo "=== Installing frontend dependencies ==="
  # Clean node_modules directory first
  if [ -d "spiffworkflow-frontend/node_modules" ]; then
    echo "Cleaning frontend node_modules directory..."
    rm -rf spiffworkflow-frontend/node_modules
  fi
  RUN_AS=$ME docker compose $YML_FILES run --rm spiffworkflow-frontend npm install
fi

# Start services
if [[ -z "$SERVICE" ]]; then
  echo "=== Starting all services ==="
  RUN_AS=$ME docker compose $YML_FILES up -d
else
  echo "=== Starting $SERVICE ==="
  RUN_AS=$ME docker compose $YML_FILES up -d $SERVICE
fi

echo "=== Services started! ==="
echo "You can access the application at http://localhost:8001"
