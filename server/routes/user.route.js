const express = require('express');
const router = express.Router();
const MSG = require('../classes/messages');

// Controllers
const UsersController = require('../mongodb/controllers/user.controller');

router.route('/login')
    .post((req, res) => {
        // Login to user account.
        UsersController.login(req.body)
            .then((data) => {
                req.session.token = data.message.token;
                req.session.tokenExpiry = data.message.tokenExpiry;
                req.session.userSecurity = data.message.security;
                res.json(data);
            })
            .catch((err) => res.json(err));
    });

router.route('/logout')
    .get((req, res) => {
        // Logout of user account.
        if(req.session.token) {
            req.session.destroy((err) => {
                if(err) {
                    return res.status(500).send(err);
                } else {
                    return res.redirect('/login');
                }
            });
        }
        return res.redirect('/login');
    });

router.route('/reauthenticate')
    .post((req, res) => {
        // Reauthenticate with token.
        UsersController.reauthenticate(req.body.token)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    });

router.route('/')
    .get((req, res) => {
        // Get all users.
        if(!req.session.token) {
            return res.redirect('/login');
        }
        if(req.session.userSecurity != 0) {
            return res.status(401).send(MSG.MSGNEEDTOBEADMIN);
        }
        UsersController.list()
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    })
    .post((req, res) => {
        // Add new user.
        if(!req.session.token) {
            return res.redirect('/login');
        }
        if(req.session.userSecurity != 0) {
            return res.status(401).send(MSG.MSGNEEDTOBEADMIN);
        }
        UsersController.add(req.body)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    });

router.route('/:id')
    .get((req, res) => {
        // Get single user.
        if(!req.session.token) {
            return res.redirect('/login');
        }
        if((req.session.userId !== req.params.id) && (req.session.userSecurity != 0)) {
            return res.status(401).send(MSG.MSGNEEDTOBEUSER);
        }
        UsersController.get(req.params.id)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    })
    .put((req, res) => {
        // Update a user.
        if(!req.session.token) {
            return res.redirect('/login');
        }
        if((req.session.userId !== req.params.id) && (req.session.userSecurity != 0)) {
            return res.status(401).send(MSG.MSGNEEDTOBEUSER);
        }
        UsersController.update(req.params.id, req.body)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    })
    .delete((req, res) => {
        // Delete a user.
        if(!req.session.token) {
            return res.redirect('/login');
        }
        if(req.session.userSecurity != 0) {
            return res.status(401).send(MSG.MSGNEEDTOBEADMIN);
        }
        UsersController.delete(req.params.id)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    });

module.exports = router;