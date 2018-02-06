# Advanced Web Assignment #2
University Advanced Web assignment #2.

# Installing
Before installing and running the project make sure you have the latest versions of node.js and npm.

Next run the following command to globally install some important packages we need:
```
$ npm i @angular/cli gulp gulp-typescript typescript -g
```

Next you can clone the GitHub repository:
```
$ git clone https://github.com/ebeenandgone/adv-web-2.git
```

Lastly make sure you run an npm install:
```
$ npm i
```

# Running (Development)
To run the server in development mode, follow these steps:
1. Run gulp to generate JavaScript files:
    ```
    $ gulp
    ```
    This will output into `/tsc` folder the generated JavaScript files. It will also watch for any changes to TypeScript files and automatically compile them.

2. Run the command:
    ```
    $ npm run dev
    ```
    This will concurrently run `node tsc/main.js` which is the server file, and `ng serve` which will serve the Angular project.

# Running (Production)
To run the server in production mode, follow the first step from the development branch, but for the second step run this command instead:
```
$ npm run prod
```