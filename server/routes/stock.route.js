const express = require('express');
const router = express.Router();
const MSG = require('../classes/messages');

// Controllers
const StockController = require('../mongodb/controllers/stock.controller');

router.route('/')
    .get((req, res) => {
        // Get all stock.
        if(!req.session.token) {
            return res.redirect('/login');
        }
        StockController.list()
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    })
    .post((req, res) => {
        // Add new stock.
        if(!req.session.token) {
            return res.redirect('/login');
        }
        if(!req.session.isAdmin) {
            return res.status(401).send(MSG.MSGNEEDTOBEADMIN);
        }
        StockController.add(req.body)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    });

router.route('/:id')
    .get((req, res) => {
        // Get a single stock item.
        if(!req.session.token) {
            return res.redirect('/login');
        }
        StockController.get(req.params.id)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    })
    .put((req, res) => {
        // Update stock.
        if(!req.session.token) {
            return res.redirect('/login');
        }
        StockController.update(req.params.id, req.body)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    })
    .delete((req, res) => {
        // Delete stock.
        if(!req.session.token) {
            return res.redirect('/login');
        }
        if(!req.session.isAdmin) {
            return res.status(401).send(MSG.MSGNEEDTOBEADMIN);
        }
        StockController.delete(req.params.id)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    });

router.route('/:id/take/:count')
    .get((req, res) => {
        // Take a specific amount of quantity from stock.
        if(!req.session.token) {
            return res.redirect('/login');
        }
        StockController.take(req.params.id, req.params.count)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    });

module.exports = router;