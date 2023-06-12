#! /bin/bash

SHORT=$1
TIMEOUT=$2

cmd="go test ./... -coverprofile=coverage.out -json"

if [ -n "$SHORT" ]; then
  cmd="$cmd -short"
fi

if [ -n "$TIMEOUT" ]; then
  cmd="$cmd -timeout ${TIMEOUT}s"
fi

cmd="${cmd} > test-report.out"

echo "$cmd"
eval "$cmd"
