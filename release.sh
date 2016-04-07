#!/bin/bash

source functions.sh

# npm version ${1:-"patch"}
cp -r lib dist
evaf templates/manifest.json > dist/manifest.json
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --pack-extension=dist \
  --pack-extension-key=crx.pem
rm -rf dist
mv dist.crx sqwilter.crx

# echo $HUB_CONFIG | base64 --decode > hub_config
hub release create -a sqwilter.crx -m "Build: $(pkg .version)" "v$(pkg .version)"

evaf templates/updates.xml > updates.xml
