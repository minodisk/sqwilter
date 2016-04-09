#!/bin/bash

source functions.sh

npm run build
npm version ${1:-"patch"}

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --pack-extension=dist \
  --pack-extension-key=crx.pem
rm -rf dist
mv dist.crx sqwilter.crx

hub release create -a sqwilter.crx -m "Build: $(pkg .version)" "v$(pkg .version)"

git commit -am "Update update URL v$(pkg .version)"
git push
