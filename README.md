# Task Tab!

[WIP!!!] This is an extension that will replace your new tab into a more productive and useful interface! The main feature is a todo list, stored on YOUR choice of storage platform: Google Drive, Dropbox, MongoDB, etc! For now, the main focus is for a Firefox extension, but once deployed, I hope to expand to Chrome too :)

If you look at earlier versions, (ie. https://github.com/MichaelZhao21/task-tab/tree/5e7bf870bd69cf77ea21d14f06fee18b872cf663), you will see that this was developed with React. Due to complications with web extensions and the complex framework of React, I have decided to convert this to a pure html/css/js project. I will be using some php functions and jquery mainly to access the DOM.

## TODO (future plans and stuff)

* Finish the basic app for personal use (using my own API for now)
* Create and host a dedicated backend, seperate from my own API (this will be a server folder in this repo)
* Add the ability for users to store in google drive, dropbox, etc
* Add instructions on how to self-host the backend
* Add an option to don't load data unless focus on the page (default new tab is on taskbar)
