const express = require('express');
const router = express.Router();

// Controllers
const UsersController = require('../mongodb/controllers/user.controller');

// Messages
const MSGNEEDTOBELOGGED = "You need to be logged in to do this.";
const MSGNEEDTOBEADMIN = "You require admin level security to do this.";
const MSGNEEDTOBEUSER = "You need to be logged in as this user, or an admin to do this.";

router.route('/')
    .get((req, res, next) => {
        // Get all users.
        if(!req.session.userId) {
            return res.status(401).send(MSGNEEDTOBELOGGED);
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
        if(!req.session.userId) {
            return res.status(401).send(MSGNEEDTOBELOGGED);
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
        if(!req.session.userId) {
            return res.status(401).send(MSGNEEDTOBELOGGED);
        }
        if(
            (req.session.userId !== req.params.id)
        ) {
            /*
            We only want to go here if:
                - We are not an admin (explicit)
                - We are not the user logged in (implicit)

            If user is admin we don't care if they're the user, let them do it.
            If user is NOT admin then we do care if they're the user.

            ...

            If we are NOT admin and NOT user, then we want to be here.

            (req.session.userId !== req.params.id) -> Are we the same person? If FALSE we cannot view (unless admin).

            */
            return res.status(401).send(MSGNEEDTOBEUSER);
        }
        UsersController.get(req.params.id)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    })
    .put((req, res) => {
        // Update a user.
        if(!req.session.userId) {
            return res.status(401).send(MSGNEEDTOBELOGGED);
        }
        if(
            !(req.session.userSecurity == 0) ||
            !(req.session.userSecurity !== 0 && (req.session.userId == req.params.id))
        ) {
            return res.status(401).send(MSGNEEDTOBEUSER);
        }
        UsersController.update(req.params.id, req.body)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    })
    .delete((req, res) => {
        // Delete a user.
        if(!req.session.userId) {
            return res.status(401).send(MSGNEEDTOBELOGGED);
        }
        if(req.session.userSecurity !== 0 || (req.session.userId !== req.params.id)) {
            return res.status(401).send(MSGNEEDTOBEUSER);
        }
        UsersController.delete(req.params.id)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    });

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
    .post((req, res) => {
        // Logout of user account.
        UsersController.logout(req.body)
            .then((data) => {
                res.json(data);
            })
            .catch((err) => res.json(err));
    });

module.exports = router;