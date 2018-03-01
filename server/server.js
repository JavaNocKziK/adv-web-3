const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = process.env.PORT || process.argv[2] || 3000;

// Route imports.
const orderRoute = require('./routes/order.route');
const userRoute = require('./routes/user.route');

// mongoose.connect('mongodb://<user>:<pass>@<url>:<port>/<database>');
// mongoose.connect('mongodb://elliot:Rugger126@ds233238.mlab.com:33238/adv-web-2-db');
// mongoose.connect('mongodb://localhost:27017/advanced_web');
// mongoose.connect('mongodb+srv://elliot:Rugger126!!??@advancedwebmongodb-levvn.mongodb.net/AdvancedWebMongoDB');
mongoose.connect('mongodb://admin:abc123@139.59.163.216:8080');

// Set CORS and other stuff.
const CORS = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
}
app.use(express.static(path.join(__dirname, 'dist')));
app.use(CORS);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'ass2',
    resave: true,
    saveUninitialized: false
}));

// Routes
app.use('/order', orderRoute);
app.use('/user', userRoute);

// Send all requests to our dist.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port);
console.log(`Listening on ${port}...`);