Advanced Web Assignment #2 &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ebeenandgone/adv-web-2/blob/master/LICENSE)
==========================


MMU University *Advanced Web* Unit assignment created by Aubrey Boorer, Elliot Keen and William Southall.


### Installation
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


### Running (Development)
To run the server in development mode, run the command:
```
$ npm run dev
```
This will concurrently run `node server/server.js` which is the server file, and `ng serve` which will serve the Angular project.

If you wish to run the API on its own then run the command:
```
$ npm run api
```


### Running (Production)
To run the server in production mode, run the command:
```
$ npm run prod
```
This will concurrently run `node server/server.js` which is the server file, and `ng build --prod` will build the Angular project for production and output it to the `dist` folder for the API to serve.

### Postman
When using the Postman script you should create a new environment and set a variable called `port`. This variable is used to build the address the request will go to, so the port can be changed easily without having to update all examples.


### System Explaination
The system is split into 4 main views - Admin, Wait, Kitchen and Counter. Each view directs the user to a different part of the system, with users with Admin status having access to all views within the system. 

* All views maintain a consisten design and include a menu bar with the ability to Logout and a title displaying where the user is within the system. 

* The Wait view displays the full restaurant menu with interactive buttons for taking orders from customers. Orders are assigned to a specific table before the order is sent to the Kitchen view. Once the orders are ready for collection from the Kitchen, the Wait view order list is updated to inform the wait staff. 

* The Kitchen view displays all orders sent by the wait view, grouped by table. Each menu item has a quantity, along with buttons so the chef can indicate when he is cooking a specific menu item. Once all items for a table are complete, an overlay asks if the order is ready for collection. There is a cancellation button within the overlay, allowing the chef to return to preparing the order if they should need to do so (in the event of a change to the order, or if menu items are dropped within the kitchen). Once the chef confirms the order is ready by pressing the overlay, the order is removed from the Kithen view and the Wait view order list is updated. 

* The Admin view displays a lists of users, stock and orders. The lists are seperated by a tab bar underneath the menu bar. Anyone with *Admin Status* has the ability to create and delete users, add or remove stock and search for orders using their 'friendly id' number (an increment based id number applied when orders are created). 


### License
This project is [MIT licensed](./LICENSE).