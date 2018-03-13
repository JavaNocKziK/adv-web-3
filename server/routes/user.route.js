const express = require('express');
const router = express.Router();
const sec = require('../classes/security');

// Controllers
const UserModel = require('../mongodb/models/user.model');
const UsersController = require('../mongodb/controllers/user.controller');

router.route('/login')
    /**
     * Login to a specified account.
     * Security: None
     */
    .post(async (req, res) => {
        let result = await UserModel.authenticate(req.body.username, req.body.password);
        if(result.status == 1) {
            req.session.userId = result.message.id;
            req.session.token = result.message.token;
            req.session.tokenExpiry = result.message.tokenExpiry;
            req.session.admin = result.message.admin;
        }
        res.status(result.code).json(result);
    });

router.route('/logout')
    /**
     * Logout of a specified account.
     * Security: [Session]
     */
    .post(async (req, res) => {
        let secResult = await sec.check(req, sec.session);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await UserModel.deauthenticate(req.body.token);
            if (result.status == 1 && req.session) req.session = null;
            res.status(result.code).json(result);
        }
    });

router.route('/reauthenticate')
    /**
     * Reauthenticate a specified account.
     * Security: None
     */
    .post(async (req, res) => {
        // Reauthenticate with token.
        let result = await UserModel.reauthenticate(req.body.token);
        if(result.status == 1) {
            req.session.userId = result.message.id;
            req.session.token = result.message.token;
            req.session.tokenExpiry = result.message.tokenExpiry;
            req.session.admin = result.message.admin;
        }
        console.log(req.session);
        res.status(result.code).json(result);
    });

router.route('/')
    /**
     * Get a list of all the users.
     * Security: [Admin & Session]
     */
    .get(async (req, res) => {
        let secResult = await sec.check(req, sec.admin, sec.session);
        console.log(req.session);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await UsersController.many(
                req.query.username,
                req.query.admin,
                req.query.homepath
            );
            res.status(result.code).json(result);
        }
    })
    /**
     * Create a new user.
     * Security: [Admin & Session]
     */
    .post(async (req, res) => {
        let secResult = await sec.check(req, sec.admin, sec.session);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await UsersController.add(req.body);
            res.status(result.code).json(result);
        }
    });

router.route('/:id')
    /**
     * Get a single user.
     * Security: [Admin|User & Session]
     */
    .get(async (req, res) => {
        let secResult = await sec.check(req, sec.session, sec.user);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await UsersController.single(req.params.id);
            res.status(result.code).json(result);
        }
    })
    /**
     * Update a single user.
     * Security: [Admin|User & Session]
     */
    .put(async (req, res) => {
        let secResult = await sec.check(req, sec.session, sec.user);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await UsersController.updateSingle(req.params.id, req.session.admin, req.body);
            res.status(result.code).json(result);
        }
    })
    /**
     * Delete a single user.
     * Security: [Admin & Session]
     */
    .delete(async (req, res) => {
        let secResult = await sec.check(req, sec.admin, sec.session);
        console.log(secResult);
        console.log(req.session);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await UsersController.deleteSingle(req.params.id);
            res.status(result.code).json(result);
        }
    });

router.route('/:id/orders')
    /**
     * Get the orders of the specific user.
     * Security: [Admin|User & Session]
     */
    .get(async (req, res) => {
        let secResult = await sec.check(req, sec.session, sec.user);
        if(!secResult.valid) {
            res.status(secResult.code).send();
        } else {
            let result = await UsersController.orders(req.params.id);
            res.status(result.code).json(result);
        }
    });

module.exports = router;
