const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let OrderSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        tableId: {
            type: String,
            required: true
        },
        content: {
            type: [{
                stockId: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }],
            required: true
        },
        timeCreated: {
            type: String,
            required: true
        }
    },
    { versionKey: false }
);

module.exports = mongoose.model('Order', OrderSchema);