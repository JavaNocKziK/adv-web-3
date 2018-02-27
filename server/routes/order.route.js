const express = require('express');
const router = express.Router();

// Classes
const Order = require('../classes/order');

// Controllers
const OrderController = require('../mongodb/controllers/order.controller');

router.route('/')
    .get((req, res) => {
        // Get all orders.
    })
    .post((req, res) => {
        // Add new order.
        let newOrder = new Order(
            req.body.orderId,
            req.body.userId,
            req.body.tableId,
            req.body.content
        );
        OrderController.add(newOrder)
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    });

module.exports = router;