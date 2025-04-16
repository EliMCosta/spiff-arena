#!/usr/bin/env bash

function error_handler() {
  echo >&2 "Exited with BAD EXIT CODE '${2}' in ${0} script at line: ${1}."
  exit "$2"
}
trap 'error_handler ${LINENO} $?' ERR
set -o errtrace -o errexit -o nounset -o pipefail

echo "=== Migrating from Makefile to simplified scripts ==="
echo ""
echo "This script will help you migrate from the old Makefile approach to the new simplified scripts."
echo ""
echo "Here's a mapping of old make commands to new scripts:"
echo ""
echo "  make dev-env         ->  ./bin/setup.sh"
echo "  make start-dev       ->  ./bin/start.sh"
echo "  make stop-dev        ->  ./bin/stop.sh"
echo "  make be-tests-par    ->  ./bin/test.sh backend"
echo "  make fe-lint-fix     ->  ./bin/test.sh frontend"
echo "  make run-pyl         ->  ./bin/test.sh"
echo "  make be-sh           ->  ./bin/shell.sh spiffworkflow-backend"
echo "  make fe-sh           ->  ./bin/shell.sh spiffworkflow-frontend"
echo "  make cp-sh           ->  ./bin/shell.sh spiffworkflow-connector"
echo "  make sh              ->  ./bin/shell.sh spiff-arena"
echo ""
echo "For cleaning up:"
echo "  ./bin/clean.sh containers    # Remove containers"
echo "  ./bin/clean.sh volumes       # Remove volumes"
echo "  ./bin/clean.sh dependencies  # Remove dependencies"
echo "  ./bin/clean.sh all           # Remove everything"
echo ""
echo "The new scripts are more flexible and easier to use."
echo "For example, you can start a specific service with:"
echo "  ./bin/start.sh spiffworkflow-backend"
echo ""
echo "Making all scripts executable..."
chmod +x bin/setup.sh bin/start.sh bin/stop.sh bin/test.sh bin/clean.sh bin/shell.sh
echo "Done!"
