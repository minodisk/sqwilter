#!/bin/bash

set -e

version=$(npm version ${1:-"patch"})
npm run build
# git commit -a -m "Bump version to v$version"
git push

# /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
#   --pack-extension=dist \
#   --pack-extension-key=crx.pem
zip dist
rm -rf dist
# mv dist.crx sqwilter.crx
mv dist.zip sqwilter.zip

# hub release create -a sqwilter.crx -m "Build: $version" "$version"
# rm -rf sqwilter.crx
# npm run updates
#
# git commit -a -m "Update crx URL to $version"
# git push
