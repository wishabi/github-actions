#! /bin/bash
set -e

TAGS=$1
TIMEOUT=$2

cmd="go test 2>&1 ./... -coverprofile=coverage.out"

if [ -n "$TAGS" ]; then
  cmd="$cmd --tags=${TAGS}"
fi

if [ -n "$TIMEOUT" ]; then
  cmd="$cmd -timeout ${TIMEOUT}s"
fi

cmd="${cmd} | tee test-report.out"

echo "$cmd"
eval "$cmd"
