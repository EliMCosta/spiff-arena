#!/usr/bin/env bash

# fix-permissions.sh - Fix permissions for the process_models directory
#
# This script ensures that the process_models directory has the correct
# permissions and ownership to prevent errors when creating or modifying
# process models. It can be run at any time to fix permission issues.
#
# It uses the common utilities from common.sh to maintain consistent
# behavior with the setup.sh and start.sh scripts.

set -o errtrace -o errexit -o nounset -o pipefail
trap 'error_handler ${LINENO} $?' ERR

# Source common utilities
script_dir="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
source "${script_dir}/common.sh"

# Ensure process_models directory has correct permissions
ensure_process_models_permissions

echo "=== Permissions fixed successfully ==="
