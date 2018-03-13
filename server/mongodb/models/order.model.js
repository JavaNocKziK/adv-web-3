const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const StockController = require('../controllers/stock.controller');

let OrderSchema = new mongoose.Schema(
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
                },
                status: {
                    type: Number,
                    required: true,
                    default: 1 // Pending
                },
                price: {
                    type: mongoose.Schema.Types.Double,
                    required: true,
                    default: 0 // £0.00
                }
            }],
            required: true
        },
        timeCreated: {
            type: Date,
            required: true,
            default: new Date()
        },
        status: {
            type: Number,
            required: true,
            default: 1 // Pending
        },
        value: {
            type: mongoose.Schema.Types.Double,
            required: true,
            min: 0,
            default: 0 // £0.00
        }
    },
    { versionKey: false }
);

/**
 * Hook into the save pre so that we can do certain things to the document before
 * it gets saved.
 */
OrderSchema.pre('save', async function(next) {
    // Generate the value of the order here.
    let allComplete = true;
    for(let i = 0; i < this.content.length; i++) {
        let result = await StockController.single(this.content[i].stockId);
        this.content[i].price.value = result.message.price;
        this.value.value += (result.message.price * this.content[i].quantity);
        if(this.content[i].status != 4) {
            allComplete = false;
        }
    }
    if(allComplete) {
        this.status = (this.status == 5 ? 5 : 4); // Archived/Completed
    } else {
        this.status = 3; // Cooking
    }
    next();
});

/**
 * Generate a new order.
 * @param order The order data.
 */
OrderSchema.statics.place = function place(order) {
    return new Promise(async (resolve) => {
        let friendlyId = await Order.nextId();
        if (friendlyId.status !== 1) return resolve({ "status": 0, "code": 500, "message": "Error generating order.", "error": friendlyId.error });
        order.friendlyId = friendlyId.value;
        Order.create(order, (err1, instance) => {
            if (err1) return resolve({ "status": 0, "code": 500, "message": "Error generating order.", "error": err1 });
            return resolve({ "status": 1, "code": 200, "message": instance });
        });
    });
}

/**
 * Generate the next friendly ID for an order.
 */
OrderSchema.statics.nextId = function nextId() {
    return new Promise((resolve) => {
        let search = Order.find();
        search.sort('-friendlyId');
        search.limit(1);
        search.exec((err1, orders) => {
            // Database error (very unlikely).
            if (err1) return resolve({ "status": 0, "value": undefined, "error": err1 });
            // If there's no order we might be the first, set to 1.
            if (!orders || orders.length == 0) return resolve({ "status": 1, "value": 1 });
            // There were orders. Take the first (it's a top 1) and precrement.
            return resolve({ "status": 1, "value": ++orders[0].friendlyId });
        });
    });
}

var Order = mongoose.model('Order', OrderSchema);
module.exports = Order;