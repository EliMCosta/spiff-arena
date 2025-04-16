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
COMPONENT="all"
if [[ $# -gt 0 ]]; then
  COMPONENT=$1
  shift
fi

ARGS=""
if [[ $# -gt 0 ]]; then
  ARGS="$@"
fi

# Run tests based on component
if [[ "$COMPONENT" == "all" || "$COMPONENT" == "frontend" ]]; then
  echo "=== Running frontend linting ==="
  RUN_AS=$ME docker compose $YML_FILES run --rm spiffworkflow-frontend npm run lint:fix
fi

if [[ "$COMPONENT" == "all" || "$COMPONENT" == "backend" ]]; then
  echo "=== Running backend tests ==="
  # Clear log file first
  RUN_AS=$ME docker compose $YML_FILES run --rm spiffworkflow-backend rm -f log/unit_testing.log
  
  # Run mypy
  echo "=== Running mypy ==="
  RUN_AS=$ME docker compose $YML_FILES run --rm spiffworkflow-backend poetry run mypy src tests
  
  # Run tests in parallel
  echo "=== Running pytest ==="
  RUN_AS=$ME docker compose $YML_FILES run --rm spiffworkflow-backend poetry run pytest -n auto -x --random-order $ARGS tests/spiffworkflow_backend/
fi

if [[ "$COMPONENT" == "all" ]]; then
  echo "=== Running ruff ==="
  RUN_AS=$ME docker compose $YML_FILES run --rm spiff-arena poetry run ruff check --fix spiffworkflow-backend
  
  echo "=== Running pre-commit ==="
  RUN_AS=$ME docker compose $YML_FILES run --rm spiff-arena poetry run pre-commit run --verbose --all-files
fi

echo "=== Tests completed! ==="
