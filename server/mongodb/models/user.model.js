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
        admin: {
            type: Boolean,
            required: true
        },
        token: {
            type: String,
            required: false
        },
        tokenExpiry: {
            type: String,
            required: false
        },
        homePath: {
            type: String,
            required: true
        }
    },
    { versionKey: false }
);

/**
 * Hook into the password setter so that we can hash the password if it changed value, or
 * if we are creating a new user.
 */
UserSchema.path('password').set(function(newValue) {
    let currentValue = this.password;
    if(!currentValue) {
        // No current value (new user).
        return bcrypt.hashSync(newValue, bcrypt.genSaltSync(1));
    }
    if(!bcrypt.compareSync(newValue, currentValue)) {
        // Values are different (password update).
        return bcrypt.hashSync(newValue, bcrypt.genSaltSync(1));
    }
    return currentValue;
});

/**
 * Used to authenticate a user. Checks their username and password to make sure they exist
 * and that the password is a match. If it is then it passes basic user data back with a
 * generated session token that is also stored against the user in the database.
 * @param username The users username.
 * @param password The users password.
 */
UserSchema.statics.authenticate = function authenticate(username, password) {
    return new Promise((resolve) => {
        User.findOne({ username: username }, (err1, user) => {
            if (err1 || !user) return resolve({ "status": 0, "code": 500, "message": "Username or password incorrect." });
            bcrypt.compare(password, user.password, (err2, match) => {
                if (err2 || !match) return resolve({ "status": 0, "code": 500, "message": "Username or password incorrect." });
                let expiry = new Date();
                expiry.setDate(expiry.getDate() + 1);
                let token = bcrypt.hashSync(`${user._id}${expiry.valueOf()}`, bcrypt.genSaltSync(1));
                User.update({ _id: user._id }, { $set: {
                    token: token,
                    tokenExpiry: expiry.toJSON()
                }}, (err3) => {
                    if (err3) return resolve({ "status": 0, "code": 500, "message": "Issue logging in." });
                    return resolve({ "status": 1, "code": 200, "message": {
                        id: user._id,
                        username: username,
                        token: token,
                        tokenExpiry: expiry.toJSON(),
                        admin: user.admin,
                        homePath: user.homePath
                    }});
                });
            });
        });
    });
}

/**
 * Remove the token and token expiry from a user so that they cannot reauthenticate in the future
 * using tokens. They will have to login again to be able to do that. We use the token instead of
 * the ID so that we can't just logout a user if we know their ID, we have to know their token
 * which is much harder, unless you are the user.
 * @param token The token that will be used to find the user.
 */
UserSchema.statics.deauthenticate = function deauthenticate(token) {
    return new Promise((resolve) => {
        let resolveError = { "status": 0, "code": 500, "message": "Issue logging out." };
        User.findOne({ token: token }, (err1, user) => {
            if (err1 || !user) return resolve(resolveError);
            User.update({ _id: user._id }, { $set: {
                token: '',
                tokenExpiry: ''
            }}, (err2) => {
                if (err2) return resolve(resolveError);
                return resolve({ "status": 1, "code": 200, "message": "" });
            });
        });
    });
}

/**
 * Reauthenticate a user session based on the token. This will allow a user to login without needing
 * the password.
 * @param token The token to reauthenticate with.
 */
UserSchema.statics.reauthenticate = function reauthenticate(token) {
    return new Promise((resolve) => {
        let resolveError = { "status": 0, "code": 500, "message": "Issue reauthenticating." };
        User.findOne({ token: token }, (err1, user) => {
            if (err1 || !user) return resolve(resolveError);
            let currentDate = new Date();
            let tokenExpiry = new Date(user.tokenExpiry);
            if (tokenExpiry < currentDate) return resolve(resolveError);
            return resolve({ "status": 0, "code": 200, "message": {
                id: user._id,
                username: user.username,
                token: user.token,
                tokenExpiry: user.tokenExpiry,
                admin: user.admin,
                homePath: user.homePath
            }});
        });
    });
}

let User = mongoose.model('User', UserSchema);
module.exports = User;