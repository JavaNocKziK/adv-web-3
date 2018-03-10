const express = require('express');
const router = express.Router();
const sec = require('../classes/security');

// Controllers
const StockController = require('../mongodb/controllers/stock.controller');

router.route('/')
    /**
     * Get a list of all the stock.
     * Security: [Session]
     */
    .get(async (req, res) => {
        let secResult = await sec.check(req, sec.session);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await StockController.many(
                req.query.name,
                req.query.category,
                [req.query.quantityFrom, req.query.quantityTo]
            );
            res.status(result.code).json(result);
        }
    })
    /**
     * Add a new stock item.
     * Security: [Admin & Session]
     */
    .post(async (req, res) => {
        let secResult = await sec.check(req, sec.admin, sec.session);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await StockController.add(req.body);
            res.status(result.code).json(result);
        }
    });

router.route('/:id')
    /**
     * Get a single stock item.
     * Security: [Session]
     */
    .get(async (req, res) => {
        let secResult = await sec.check(req, sec.session);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await StockController.single(req.params.id);
            res.status(result.code).json(result);
        }
    })
    /**
     * Update a single stock item.
     * Security: [Admin & Session]
     */
    .put(async (req, res) => {
        let secResult = await sec.check(req, sec.admin, sec.session);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await StockController.updateSingle(req.params.id, req.body);
            res.status(result.code).json(result);
        }
    })
    /**
     * Delete a single stock item.
     * Security: [Admin & Session]
     */
    .delete(async (req, res) => {
        let secResult = await sec.check(req, sec.admin, sec.session);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await StockController.deleteSingle(req.params.id);
            res.status(result.code).json(result);
        }
    });

module.exports = router;