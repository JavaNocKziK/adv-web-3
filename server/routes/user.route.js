const express = require('express');
const router = express.Router();

// Controllers
const UsersController = require('../mongodb/controllers/user.controller');

router.route('/')
    .get((req, res) => {
        // Get all users.
        UsersController.list()
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    })
    .post((req, res) => {
        // Add new user.
        UsersController.add(req.body)
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    });

router.route('/:id')
    .get((req, res) => {
        // Get single user.
        UsersController.get(req.params.id)
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    })
    .put((req, res) => {
        // Update a user.
        UsersController.update(req.params.id, req.body)
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    })
    .delete((req, res) => {
        // Delete a user.
        UsersController.delete(req.params.id)
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    });

router.route('/:id/login')
    .post((req, res) => {
        // Login to user account.
        UsersController.login(req.params.id, req.body)
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    });

router.route('/:id/logout')
    .post((req, res) => {
        // Logout of user account.
        UsersController.logout(req.params.id, req.body)
            .then((data)    => res.json(data))
            .catch((data)   => res.json(data));
    });

module.exports = router;