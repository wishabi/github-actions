#! /bin/bash

go install github.com/jstemmer/go-junit-report/v2@latest

TAGS=$1
TIMEOUT=$2

cmd="go test 2>&1 ./... -coverprofile=coverage.out"

if [ -n "$TAGS" ]; then
  cmd="$cmd --tags=${TAGS}"
fi

if [ -n "$TIMEOUT" ]; then
  cmd="$cmd -timeout ${TIMEOUT}s"
fi

cmd="${cmd} | go-junit-report -set-exit-code > report.xml"

echo "$cmd"
eval "$cmd"
