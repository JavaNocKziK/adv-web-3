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
                    reject({
                        "status": 0,
                        "message": err
                    });
                }
                if(!user) {
                    reject({
                        "status": 0,
                        "message": "User not found."
                    });
                }
                bcrypt.compare(password, user.password, (err, result) => {
                    if(result === true) {
                        accept({
                            "status": 1,
                            "message": user
                        });
                    } else {
                        reject({
                            "status": 0,
                            "message": "Password mismatch."
                        });
                    }
                });
            });
    });
};
let User = mongoose.model('User', UserSchema);
module.exports = User;