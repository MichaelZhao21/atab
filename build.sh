#!/bin/bash

echo "bundling app into zip archive..."
rm atab.zip
zip -r atab.zip LICENSE.md manifest.json README.md dist
echo "finished bundling!"
