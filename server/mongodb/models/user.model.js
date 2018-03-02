const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        security: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: false
        },
        tokenExpiry: {
            type: String,
            required: false
        }
    },
    { versionKey: false }
);

/**
 * Used to authenticate a user. Checks their username and password to make sure they exist
 * and that the password is a match. If it is then it passes basic user data back with a
 * generated session token that is also stored against the user in the database.
 */
UserSchema.statics.authenticate = function authenticate(username, password) {
    return new Promise((accept, reject) => {
        User.findOne({ username: username })
            .exec((err, user) => {
                if(err) {
                    reject(err);
                } else {
                    if(!user) {
                        reject("Username or password incorrect.");
                    } else {
                        bcrypt.compare(password, user.password, (err, result) => {
                            if(result === true) {
                                let expiry = new Date();
                                expiry.setDate(expiry.getDate() + 1);
                                let token = bcrypt.hashSync(`${user._id}${expiry.valueOf()}`, bcrypt.genSaltSync(1))
                                user.token = token;
                                user.tokenExpiry = expiry.toJSON();
                                user.save((err) => {
                                    if(err) {
                                        reject(err);
                                    } else {
                                        accept({
                                            id: user._id,
                                            token: token,
                                            tokenExpiry: expiry.toJSON(),
                                            security: user.security
                                        });
                                    }
                                });
                            } else {
                                reject("Username or password incorrect.");
                            }
                        });
                    }
                }
            });
    });
};

UserSchema.statics.deauthenticate = function deauthenticate(token) {
    return new Promise((accept, reject) => {
        User.findOne({ token: token })
            .exec((err, user) => {
                if(err) {
                    // Some generic database error. Couldn't deauth.
                    reject(err);
                } else {
                    if(!user) {
                        // Just accept if user doesn't exist, deauthing here isn't a security issue.
                        accept();
                    } else {
                        // User exists, strip token and expiry from database.
                        user.token = undefined;
                        user.tokenExpiry = undefined;
                        user.save((err) => {
                            if(err) {
                                reject(err);
                            } else {
                                accept();
                            }
                        });
                    }
                }
            });
    });
};

/**
 * Reauthenticate a user session based on the token.
 */
UserSchema.statics.reauthenticate = function reauthenticate(token) {
    return new Promise((accept, reject) => {
        User.findOne({ token: token })
            .exec((err, user) => {
                if(err) {
                    // Some generic database error.
                    reject(err);
                } else {
                    if(!user) {
                        // Token doesn't exist, we're not logged in.
                        reject("Token invalid.");
                    } else {
                        // Token does exist, but we should check expiry.
                        let tokenExpiry = new Date(user.tokenExpiry);
                        let currentDate = new Date();
                        if(tokenExpiry < currentDate) {
                            // Token expired.
                            reject("Token invalid.");
                        } else {
                            // Token valid.
                            accept({
                                id: user._id,
                                username: user.username,
                                security: user.security
                            });
                        }
                    }
                }
            });
    });
};
let User = mongoose.model('User', UserSchema);
module.exports = User;