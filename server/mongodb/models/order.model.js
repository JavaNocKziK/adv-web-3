const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let OrderSchema = new Schema(
    {
        orderId: Number,
        userId: Number,
        tableId: Number,
        content: [Number],
        timeCreated: String
    },
    { versionKey: false }
);

module.exports = mongoose.model('Order', OrderSchema);