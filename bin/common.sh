#!/usr/bin/env bash

# Common utility functions and variables for spiff-arena scripts
#
# This script provides shared functionality for all spiff-arena scripts.
# It should be sourced by other scripts rather than executed directly.
#
# Usage in other scripts:
#   script_dir="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
#   source "${script_dir}/common.sh"

function error_handler() {
  echo >&2 "Exited with BAD EXIT CODE '${2}' in ${0} script at line: ${1}."
  exit "$2"
}

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

# Function to ensure process_models directory has correct permissions
#
# This function:
# - Creates the process_models directory if it doesn't exist
# - Sets the correct permissions (755) on the directory
# - Sets the correct ownership to match the current user
# - Updates permissions inside running containers if they exist
#
# It's called automatically by setup.sh and start.sh, and can be called
# directly by fix-permissions.sh when needed.
ensure_process_models_permissions() {
  # Ensure process_models directory exists
  if [ ! -d "process_models" ]; then
    echo "=== Creating process_models directory ==="
    mkdir -p process_models
  fi

  # Set proper permissions for process_models directory
  echo "=== Setting proper permissions for process_models directory ==="
  chmod 755 process_models
  chown $USER_ID:$GROUP_ID process_models

  # If containers are running, update permissions inside containers
  if docker ps | grep -q spiffworkflow-backend; then
    echo "=== Updating permissions inside containers ==="
    docker exec -it spiffworkflow-backend bash -c "chown -R $(id -u):$(id -g) /app/process_models" || true
  fi
}
