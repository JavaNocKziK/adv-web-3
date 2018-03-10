const express = require('express');
const router = express.Router();
const sec = require('../classes/security');

// Controllers
const OrderController = require('../mongodb/controllers/order.controller');

router.route('/')
    /**
     * Get a list of all the orders.
     * Security: [Session]
     */
    .get(async (req, res) => {
        let secResult = await sec.check(req, sec.session);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await OrderController.many(
                req.query.detail,
                req.query.status,
                [req.query.dateAfter, req.query.dateBefore]
            );
            res.status(result.code).json(result);
        }
    })
    /**
     * Add a new order.
     * Security: [Session]
     */
    .post(async (req, res) => {
        let secResult = await sec.check(req, sec.session);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await OrderController.add(req.body);
            res.status(result.code).json(result);
        }
    });

router.route('/statuses')
    /**
     * Add a new order.
     * Security: [Session]
     */
    .get(async (req, res) => {
        let secResult = await sec.check(req, sec.session);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await OrderController.statuses();
            res.status(result.code).json(result);
        }
    });

router.route('/:id')
    /**
     * Get a single order.
     * Security: [Session]
     */
    .get(async (req, res) => {
        let secResult = await sec.check(req, sec.session);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await OrderController.single(req.param.id);
            res.status(result.code).json(result);
        }
    })
    /**
     * Update a single order.
     * Security: [Session]
     */
    .put(async (req, res) => {
        let secResult = await sec.check(req, sec.session);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await OrderController.updateSingle(req.param.id, req.body);
            res.status(result.code).json(result);
        }
    })
    /**
     * Delete a single order.
     * Security: [Admin & Session]
     */
    .delete(async (req, res) => {
        let secResult = await sec.check(req, sec.admin, sec.session);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await OrderController.deleteSingle(req.param.id);
            res.status(result.code).json(result);
        }
    });

module.exports = router;