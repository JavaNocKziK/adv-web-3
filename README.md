# Advanced Web Assignment #2  
![license](https://img.shields.io/github/license/mashape/apistatus.svg)

MMU University *Advanced Web* Unit assignment created by Aubrey Boorer, Elliot Keen and William Southall.

## Postman

When using the Postman script you should create a new environment and set a variable under there called `port`. This variable is used to build the address the request will go to, so that we can change the port easily without having to update all the examples.

## Installation

Before installing and running the project make sure you have the latest versions of node.js and npm.

Next run the following command to globally install some important packages we need:
```
$ npm i @angular/cli -g
```

Next you can clone the GitHub repository:
```
$ git clone https://github.com/ebeenandgone/adv-web-2.git
```

Lastly make sure you run an npm install:
```
$ npm i
```

## Running (Development)
To run the server in development mode, run the command:
```
$ npm run dev
```
This will concurrently run `node server/server.js` which is the server file, and `ng serve` which will serve the Angular project.

If you wish to run the API on its own then run the command:
```
$ npm run api
```

## Running (Production)
To run the server in production mode, run the command:
```
$ npm run prod
```
This will concurrently run `node server/server.js` which is the server file, and `ng build --prod` will build the Angular project for production and output it to the `dist` folder for the API to serve.