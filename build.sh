#!/bin/bash

echo "bundling app into zip..."
rm atab.zip
zip -r atab.zip LICENSE.md manifest.json README.md lib res src
echo "finished bundling!"