const mongoose = require('mongoose');
let OrderStatusSchema = new mongoose.Schema(
    {
        value: {
            type: Number,
            unique: true,
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