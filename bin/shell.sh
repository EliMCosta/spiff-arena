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

# Parse command line arguments
SERVICE="spiff-arena"
if [[ $# -gt 0 ]]; then
  SERVICE=$1
fi

# Open shell in the specified service
echo "=== Opening shell in $SERVICE ==="
RUN_AS=$ME docker compose $YML_FILES run --rm $SERVICE /bin/bash
