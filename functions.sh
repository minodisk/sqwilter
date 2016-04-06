#!/bin/bash

pkg () {
  local query=$1
  cat package.json | jq -r "$query"
}

evaf () {
  local filename=$1
  local current_file=functions.sh
  printf "source $current_file && cat <<++EOS\n$(cat $filename)\n++EOS" | bash
}
