const express = require('express');
const router = express.Router();

// Controllers
const OrderController = require('../mongodb/controllers/order.controller');

router.route('/')
    .get((req, res) => {
        // Get all orders.
        OrderController.list()
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    })
    .post((req, res) => {
        // Add new order.
        OrderController.add(req.body)
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    });

router.route('/:id')
    .get((req, res) => {
        // Get single order.
        OrderController.get(req.params.id)
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    })
    .put((req, res) => {
        // Update an order.
        OrderController.update(req.params.id, req.body)
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    })
    .delete((req, res) => {
        // Delete an order.
        OrderController.delete(req.params.id)
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    })

module.exports = router;