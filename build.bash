echo "bundling app into zip..."
rm task-tab.zip
zip -r task-tab.zip LICENSE.md manifest.json README.md lib res src
echo "finished bundling!"