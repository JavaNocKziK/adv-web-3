const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let OrderSchema = new Schema(
    {
        friendlyId: {
            type: Number,
            required: true,
            unique: true,
            min: 1
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

/**
 * Place an order.
 * @param order The data of the order you want to save.
 */
OrderSchema.statics.place = async function place(order) {
    return new Promise((resolve) => {
        Order.create(order, (err, instance) => {
            if(err) {
                resolve({ "status": 0, "message": err });
            } else {
                resolve({ "status": 1, "message": instance });
            }
        });
    });
}

/**
 * Get the next friendly ID of an order.
 */
OrderSchema.statics.nextId = async function nextId() {
    return new Promise((resolve) => {
        Order
            .find()
            .sort('-friendlyId')
            .limit(1)
            .exec(
        (err, data) => {
            if(err) {
                resolve(0);
            } else {
                if(data.length == 0) {
                    resolve(1);
                } else {
                    resolve(++data[0].friendlyId);
                }
            }
        });
    });
}

var Order = mongoose.model('Order', OrderSchema);
module.exports = Order;