const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

let StockSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        detail: {
            type: String,
            required: false
        },
        category: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 0
        },
        price: {
            type: mongoose.Schema.Types.Double,
            required: false,
            min: 0,
            default: 0
        }
    },
    { versionKey: false }
);

/**
 * To take stock make the count negative. To give stock make the count positive.
 */
StockSchema.statics.adjust = function adjust(id, count) {
    return new Promise((resolve) => {
        Stock.findById(id, (err1, stock) => {
            if (err1 || !stock) return resolve({ "status": 0, "code": 500, "message": "Error adjusting stock.", "error": err1 });
            stock.quantity = (stock.quantity + count);
            stock.save((err2) => {
                if (err2) return resolve({ "status": 0, "code": 500, "message": "Error adjusting stock.", "error": err2 });
                return resolve({ "status": 1, "code": 200, "message": "" });
            });
        });
    });
};

var Stock = mongoose.model('Stock', StockSchema);
module.exports = Stock;