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
