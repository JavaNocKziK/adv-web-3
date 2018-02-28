const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let UserSchema = new Schema(
    {
        username: String,
        password: String,
        security: Number
    },
    { versionKey: false }
);

module.exports = mongoose.model('User', UserSchema);