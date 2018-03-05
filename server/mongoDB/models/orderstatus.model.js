const mongoose = require('mongoose');
let OrderStatusSchema = new mongoose.Schema(
    {
        value: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    { versionKey: false }
);

module.exports = mongoose.model('OrderStatus', OrderStatusSchema);