const express = require('express');
const router = express.Router();
const MSG = require('../classes/messages');

// Controllers
const OrderController = require('../mongodb/controllers/order.controller');

router.route('/')
    .get((req, res) => {
        // Get all orders.
        if(!req.session) {
            return res.redirect('/login');
        }
        OrderController.list()
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    })
    .post((req, res) => {
        // Add new order.
        if(!req.session) {
            return res.redirect('/login');
        }
        OrderController.add(req.body)
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    });

router.route('/:id')
    .get((req, res) => {
        // Get single order.
        if(!req.session) {
            return res.redirect('/login');
        }
        OrderController.get(req.params.id)
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    })
    .put((req, res) => {
        // Update an order.
        if(!req.session) {
            return res.redirect('/login');
        }
        OrderController.update(req.params.id, req.body)
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    })
    .delete((req, res) => {
        // Delete an order.
        if(!req.session) {
            return res.redirect('/login');
        }
        if(req.session.userSecurity != 0) {
            return res.status(401).send(MSG.MSGNEEDTOBEADMIN);
        }
        OrderController.delete(req.params.id)
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    })

module.exports = router;