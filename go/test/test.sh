#! /bin/bash
set -e

TAGS=$1
TIMEOUT=$2

cmd="go test 2>&1 ./... -coverprofile=coverage.out"

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

echo "$cmd  | tee test-report.out"
eval "$cmd" | tee test-report.out

exit ${PIPESTATUS[0]}
