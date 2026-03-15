#!/bin/bash

RED="\033[0;31m"
GREEN="\033[0;32m"
NC="\033[0m"

FAIL=0

while IFS= read -r url; do
  [[ -z "$url" ]] && continue

  code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "ERR")

  if [[ "$code" == 2* ]]; then
    echo -e "$url -> ${GREEN}$code${NC}"
  else
    echo -e "$url -> ${RED}$code${NC}"
    FAIL=1
  fi
done < "./dist/urls.txt"

exit $FAIL
