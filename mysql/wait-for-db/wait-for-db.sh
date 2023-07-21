#!/usr/bin/env bash

COUNT=0

while [[ $COUNT == 0 ]] || [[ $OUTPUT == *"ERROR 2013 (HY000)"* ]] || [[ $OUTPUT == *"ERROR 2002 (HY000)"* ]]
do
    if [ $COUNT -gt 0 ]
    then
      echo "Waiting for database to be ready ..."
      sleep 5
    fi
    OUTPUT=$(mysql -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" -e "SELECT 1" 2>&1)
    RETURN_CODE=$?
    COUNT=$(( COUNT + 1 ))
done

if [[ $OUTPUT == *"ERROR 2003 (HY000)"* ]]
then
  echo "Could not connect to database: Check database logs"
  exit $RETURN_CODE
fi

if [ $RETURN_CODE -ne 0 ]
then
  echo "$OUTPUT"
  exit $RETURN_CODE
fi