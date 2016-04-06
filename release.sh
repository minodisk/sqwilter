#!/bin/bash

source functions.sh

npm version ${1:-"patch"}
cp -r lib dist
evaf manifest.json > dist/manifest.json
