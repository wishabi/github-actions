#! /bin/bash
set -eu

TAGS=${TEST_TAGS:-}
TIMEOUT=${TEST_TIMEOUT:-}
PARALLEL=${TEST_PARALLEL:-true}

cmd="go test -v ./... -coverprofile=coverage.out"

# find non-ignored subdirectories
file_list=()

for dir in */; do
   if ! git check-ignore -q "$dir"; then
    file_list+=("./$dir...")
   fi
done

# set delimiter to , so we can join the list with commas
old_ifs=$IFS
IFS=,
package_list="${file_list[*]}"
IFS=$old_ifs # put delimiter back to the original value

cmd="$cmd -coverpkg $package_list"

if [ -n "$TAGS" ]; then
  cmd="$cmd --tags=${TAGS}"
fi

if [ -n "$TIMEOUT" ]; then
  cmd="$cmd -timeout ${TIMEOUT}s"
fi

if [ "$PARALLEL" = "false" ]; then
  cmd="$cmd -p 1"
fi

echo "$cmd | tee test-report.out"
bash -c "$cmd" 2>&1 | tee test-report.out

exit ${PIPESTATUS[0]}
