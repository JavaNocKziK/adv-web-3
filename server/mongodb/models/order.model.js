const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let OrderSchema = new Schema(
    {
        friendlyId: {
            type: Number,
            required: true,
            unique: true
        },
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
        },
        status: {
            type: Number,
            required: true
        }
    },
    { versionKey: false }
);

// Generate the next user-friendly order ID.
OrderSchema.statics.nextId = function nextId() {
    return new Promise((accept, reject) => {
        Order
            .find()
            .sort('-friendlyId')
            .limit(1)
            .exec(
        (err, data) => {
            if(err) {
                reject();
            } else {
                if(data.length == 0) {
                    accept(1);
                } else {
                    accept(++data[0].friendlyId);
                }
            }
        });
    });
}

var Order = mongoose.model('Order', OrderSchema);
module.exports = Order;