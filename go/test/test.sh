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

echo "$cmd  | tee test-report.out"
eval "$cmd" | tee test-report.out

exit ${PIPESTATUS[0]}
