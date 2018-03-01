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
        }
    },
    { versionKey: false }
);
UserSchema.pre('save', function(next) {
    let user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if(err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});
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
                                accept(user);
                            } else {
                                reject("Username or password incorrect.");
                            }
                        });
                    }
                }
            });
    });
};
let User = mongoose.model('User', UserSchema);
module.exports = User;