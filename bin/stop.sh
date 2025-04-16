#!/usr/bin/env bash

set -o errtrace -o errexit -o nounset -o pipefail
trap 'error_handler ${LINENO} $?' ERR

# Source common utilities
script_dir="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
source "${script_dir}/common.sh"

echo "=== Stopping all services ==="
RUN_AS=$ME docker compose $YML_FILES down

echo "=== All services stopped ==="
