# Task Tab!

[WIP!!!] This is an extension that will replace your new tab into a more productive and useful interface! The main feature is a todo list, stored on YOUR choice of storage platform: Google Drive, Dropbox, MongoDB, etc! For now, the main focus is for a Firefox extension, but once deployed, I hope to expand to Chrome too :)

If you look at earlier versions, (ie. https://github.com/MichaelZhao21/task-tab/tree/5e7bf870bd69cf77ea21d14f06fee18b872cf663), you will see that this was developed with React. Due to complications with web extensions and the complex framework of React, I have decided to convert this to a pure html/css/js project. I will be using some php functions and jquery mainly to access the DOM.

## Installation

There is no need to build the frontend! Simply follow [this guide](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/) to install a temporary add-on.

For the backend, navigate to the `server` folder and run `yarn install`. To test the backend out, simply run `yarn start`!

## Deployment

This app uses a serverless express backend, hosted on an AWS Lambda function. You must install the [serverless cli](https://www.serverless.com/framework/docs/getting-started/) to run the following commands (Easiest way to install is using npm: `npm i -g serverless`). Navigate to the `server` folder and run the following:

```
serverless
yarn install
serverless deploy
```

Prompts should come up that asks for AWS keys and how to create them. Follow the prompts and simply install the neccessary libraries and deploy it!

For production, use `serverless deploy --stage production`

## TODO (future plans and stuff)

* Create and host a dedicated backend, seperate from my own API (this will be a server folder in this repo)
* Add the ability for users to store in google drive, dropbox, etc
* Add instructions on how to self-host the backend
* Add an option to don't load data unless focus on the page (default new tab is on taskbar)
