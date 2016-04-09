#!/bin/bash

set -e

npm run build
version=$(npm version ${1:-"patch"})
# git commit -a -m "Bump version to v$version"
git push

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --pack-extension=dist \
  --pack-extension-key=crx.pem
rm -rf dist
mv dist.crx sqwilter.crx

hub release create -a sqwilter.crx -m "Build: $version" "$version"
rm -rf sqwilter.crx
npm run updates

git commit -a -m "Update crx URL to $version"
git push
