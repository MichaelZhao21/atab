# aTab

This is an extension that will replace your new tab into a more productive and useful interface! The interface features an aesthetic background, a news feed (from NYT's API), a place to jot down quick notes that can sync across devices, and a nice date/time display.

## Install the Extension

Check in the [releases tab](https://github.com/MichaelZhao21/task-tab/releases) and download `task-tab-X.X.xpi` (where X.X is the version) and follow [these instructions](https://extensionworkshop.com/documentation/publish/distribute-sideloading/) to add the plugin to firefox!

## Development

There is no need to build the app! Simply follow [this guide](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/) to install a temporary add-on and you may edit code to your heart's content! There are certain limitations that you must be aware of when working with an extension! You cannot use any templating engine, which rules out a lot of libraries. There are workarounds, but for my simple app it was more of a hassle than it was worth. That means a lot of the UI modifications I do are using jquery (I know, pretty archaic ahah), but I still try to stick to modern coding paradigms most of the time.

# Build

Again, no need to explicitly *build*; simply run `build.sh` to bundle all files into a zip file :DD
