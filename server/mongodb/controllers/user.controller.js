const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const OrderModel = require('../models/order.model');
const UserModel = require('../models/user.model');

module.exports = {
    /**
     * Create a new user.
     * @param user The data of the new user you want to generate.
     */
    add: (user) => {
        return new Promise((resolve) => {
            UserModel.create(user, (err, instance) => {
                if (err) return resolve({ "status": 0, "code": 500, "message": err });
                return resolve({ "status": 1, "code": 200, "message": instance });
            });
        });
    },
    /**
     * Get a single user from an ID.
     * @param id The user ID.
     */
    single: (id) => {
        return new Promise((resolve) => {
            UserModel.findOne({ _id: id }, (err1, user) => {
                if (err1 || !user) return resolve({ "status": 0, "code": 500, "message": "Invalid user." });
                return resolve({ "status": 1, "code": 200, "message": user });
            });
        });
    },
    /**
     * Get many users.
     * @param username Search for a username or part of a username.
     * @param admin Search if someone is an admin or not.
     * @param homePath Search for a user based on their home path.
     */
    many: (username, admin, homePath) => {
        return new Promise((resolve) => {
            let search = UserModel.find();
            if (username)   search.where('username').regex(new RegExp(username, 'gi'));
            if (homePath)   search.where('homePath').regex(new RegExp(homePath, 'gi'));
            if (admin)      search.where('admin').equals(admin);
            search.exec((err1, users) => {
                if (err1 || !users) return resolve({ "status": 0, "code": 500, "message": "Issue obtaining users.", "error": err1 });
                return resolve({ "status": 1, "code": 200, "message": users });
            });
        });
    },
    /**
     * Update the information stored against a single user.
     * @param id The ID of the user you want the changes to apply to.
     * @param data The changes you want to make to the user.
     */
    updateSingle: (id, isAdmin, data) => {
        return new Promise((resolve) => {
            if (isAdmin === undefined) return resolve({ "status": 0, "code": 500, "message": "Error updating user." });
            UserModel.findById(id, (err1, user) => {
                if (err1 || !user) return resolve({ "status": 0, "code": 500, "message": "Error updating user.", "error": err1 });
                if (data.password)  user.password = data.password;
                if(isAdmin) {
                    // We only want the user to be able to change these if they're an admin.
                    if (data.homePath)  user.homePath = data.homePath;
                    if (data.admin)     user.admin = data.admin;
                }
                user.save((err2) => {
                    if (err2) return resolve({ "status": 0, "code": 500, "message": "Error updating user.", "error": err2 });
                    return resolve({ "status": 1, "code": 200, "message": "" });
                });
            });
        });
    },
    /**
     * Potential future implementation of a function to update
     * many users as the same time.
     * @param ids A list of IDs you want the update to apply to.
     * @param data The changes you want to make to the users.
     */
    updateMany: (ids, data) => {
        return new Promise((resolve) => {
            resolve({ "status": 0, "code": 501, "message": "" });
        });
    },
    /**
     * Delete a single user.
     * @param id The ID of the user you want to delete.
     */
    deleteSingle: (id) => {
        return new Promise((resolve) => {
            UserModel.remove({ _id: id }, (err) => {
                if (err) return resolve({ "status": 0, "code": 500, "message": "Error deleting user.", "error": err });
                return resolve({ "status": 1, "code": 200, "message": "" });
            });
        });
    },
    /**
     * Delete multiple users.
     * @param ids The IDs of the users you want to delete.
     */
    deleteMany: (ids) => {
        return new Promise((resolve) => {
            resolve({ "status": 0, "code": 501, "message": "" });
        });
    },
    /**
     * Potential future implementation of a function to delete
     * many users at the same time.
     * @param id The ID of the user of which to return orders.
     */
    orders: (id) => {
        return new Promise((resolve) => {
            OrderModel.find({ userId: id }, (err, orders) => {
                if (err | !orders) return resolve({ "status": 0, "code": 500, "message": "Unable to retrieve orders." });
                return resolve({ "status": 1, "code": 200, "message": orders });
            });
        });
    }
}