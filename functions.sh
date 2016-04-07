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

crx_url () {
  curl -s https://api.github.com/repos/minodisk/sqwilter/releases/latest | jq -r ".assets[0].browser_download_url"
}
