#! /bin/bash

TAGS=$1
TIMEOUT=$2

cmd="go test ./... -coverprofile=coverage.out -json"

if [ -n "$TAGS" ]; then
  cmd="$cmd --tags=${TAGS}"
fi

if [ -n "$TIMEOUT" ]; then
  cmd="$cmd -timeout ${TIMEOUT}s"
fi

cmd="${cmd} > test-report.out"

echo "$cmd"
eval "$cmd"
