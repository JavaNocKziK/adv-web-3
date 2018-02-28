const express = require('express');
const router = express.Router();

// Controllers
const UsersController = require('../mongodb/controllers/user.controller');

// Messages
const MSGNEEDTOBEADMIN = "You require admin level security to do this.";
const MSGNEEDTOBEUSER = "You need to be logged in as this user, or have admin level security to do this.";

router.route('/login')
    .post((req, res) => {
        // Login to user account.
        UsersController.login(req.body)
            .then((data) => {
                req.session.userId = data.message.id;
                req.session.userSecurity = data.message.security;
                res.json(data);
            })
            .catch((err) => res.json(err));
    });

router.route('/logout')
    .get((req, res) => {
        // Logout of user account.
        if(req.session) {
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

router.route('/')
    .get((req, res) => {
        // Get all users.
        if(!req.session) {
            return res.redirect('/login');
        }
        if(req.session.userSecurity != 0) {
            return res.status(401).send(MSGNEEDTOBEADMIN);
        }
        UsersController.list()
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    })
    .post((req, res) => {
        // Add new user.
        if(!req.session) {
            return res.redirect('/login');
        }
        if(req.session.userSecurity != 0) {
            return res.status(401).send(MSGNEEDTOBEADMIN);
        }
        UsersController.add(req.body)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    });

router.route('/:id')
    .get((req, res) => {
        // Get single user.
        if(!req.session) {
            return res.redirect('/login');
        }
        if((req.session.userId !== req.params.id) && (req.session.userSecurity != 0)) {
            return res.status(401).send(MSGNEEDTOBEUSER);
        }
        UsersController.get(req.params.id)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    })
    .put((req, res) => {
        // Update a user.
        if(!req.session) {
            return res.redirect('/login');
        }
        if((req.session.userId !== req.params.id) && (req.session.userSecurity != 0)) {
            return res.status(401).send(MSGNEEDTOBEUSER);
        }
        UsersController.update(req.params.id, req.body)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    })
    .delete((req, res) => {
        // Delete a user.
        if(!req.session) {
            return res.redirect('/login');
        }
        if(req.session.userSecurity != 0) {
            return res.status(401).send(MSGNEEDTOBEADMIN);
        }
        UsersController.delete(req.params.id)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    });

module.exports = router;