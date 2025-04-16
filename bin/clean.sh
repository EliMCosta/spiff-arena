#!/usr/bin/env bash

function error_handler() {
  echo >&2 "Exited with BAD EXIT CODE '${2}' in ${0} script at line: ${1}."
  exit "$2"
}
trap 'error_handler ${LINENO} $?' ERR
set -o errtrace -o errexit -o nounset -o pipefail

# Get user and group IDs for proper permissions
USER_ID=$(id -u)
USER_NAME=$(id -un)
GROUP_ID=$(id -g)
GROUP_NAME=$(id -gn)
ME="${USER_ID}:${GROUP_ID}"

# Define Docker Compose files
YML_FILES="-f docker-compose.yml \
  -f spiffworkflow-backend/dev.docker-compose.yml \
  -f spiffworkflow-frontend/dev.docker-compose.yml \
  -f connector-proxy-demo/dev.docker-compose.yml \
  -f dev.docker-compose.yml"

# Stop all services first
./bin/stop.sh

# Parse command line arguments
CLEAN_TYPE="containers"
if [[ $# -gt 0 ]]; then
  CLEAN_TYPE=$1
fi

if [[ "$CLEAN_TYPE" == "containers" || "$CLEAN_TYPE" == "all" ]]; then
  echo "=== Removing containers ==="
  RUN_AS=$ME docker compose $YML_FILES down
fi

if [[ "$CLEAN_TYPE" == "volumes" || "$CLEAN_TYPE" == "all" ]]; then
  echo "=== Removing volumes ==="
  RUN_AS=$ME docker compose $YML_FILES down -v
  
  # Remove specific volumes if they exist
  docker volume rm spiffworkflow_backend_db 2>/dev/null || true
  docker volume rm spiffworkflow-backend_spiffworkflow_backend 2>/dev/null || true
fi

if [[ "$CLEAN_TYPE" == "dependencies" || "$CLEAN_TYPE" == "all" ]]; then
  echo "=== Removing backend dependencies ==="
  if [ -d "spiffworkflow-backend/.venv" ]; then
    rm -rf "spiffworkflow-backend/.venv"
  fi
  
  echo "=== Removing frontend dependencies ==="
  if [ -d "spiffworkflow-frontend/node_modules" ]; then
    rm -rf "spiffworkflow-frontend/node_modules"
  fi
  
  echo "=== Removing connector-proxy dependencies ==="
  if [ -d "connector-proxy-demo/.venv" ]; then
    rm -rf "connector-proxy-demo/.venv"
  fi
  
  echo "=== Removing arena dependencies ==="
  if [ -d ".venv" ]; then
    rm -rf ".venv"
  fi
fi

if [[ "$CLEAN_TYPE" == "images" || "$CLEAN_TYPE" == "all" ]]; then
  echo "=== Removing Docker images ==="
  docker images | grep spiffworkflow | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true
fi

echo "=== Clean up complete! ==="
