#!/usr/bin/env bash

set -o errtrace -o errexit -o nounset -o pipefail
trap 'error_handler ${LINENO} $?' ERR

# Source common utilities
script_dir="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
source "${script_dir}/common.sh"

# Ensure process_models directory has correct permissions
ensure_process_models_permissions

echo "=== Building Docker images ==="
RUN_AS=$ME docker compose $YML_FILES build \
  --build-arg USER_ID=$USER_ID \
  --build-arg USER_NAME=$USER_NAME \
  --build-arg GROUP_ID=$GROUP_ID \
  --build-arg GROUP_NAME=$GROUP_NAME

echo "=== Installing backend dependencies ==="
RUN_AS=$ME docker compose $YML_FILES run --rm spiffworkflow-backend poetry install

echo "=== Installing connector-proxy dependencies ==="
RUN_AS=$ME docker compose $YML_FILES run --rm spiffworkflow-connector poetry install

echo "=== Installing frontend dependencies ==="
RUN_AS=$ME docker compose $YML_FILES run --rm spiffworkflow-frontend npm install
# Restore package-lock.json if needed
if [ -f "spiffworkflow-frontend/package-lock.json.backup" ]; then
  cp spiffworkflow-frontend/package-lock.json.backup spiffworkflow-frontend/package-lock.json
fi

echo "=== Installing arena dependencies ==="
RUN_AS=$ME docker compose $YML_FILES run --rm spiff-arena poetry install --no-root

echo "=== Setting up backend database ==="
RUN_AS=$ME docker compose $YML_FILES run --rm spiffworkflow-backend ./bin/recreate_db clean

echo "=== Setup complete! ==="
echo "Run './bin/start.sh' to start the application"
