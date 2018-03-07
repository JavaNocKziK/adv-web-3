const mongoose = require('mongoose');
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
        }
    },
    { versionKey: false }
);

/**
 * To take stock make the count negative. To give stock make the count positive.
 */
StockSchema.statics.adjust = async function adjust(id, count) {
    return new Promise((resolve) => {
        Stock.findById(id, (err, stock) => {
            if(err) {
                resolve({ "status": 0, "message": err });
            } else {
                if(!stock) {
                    resolve({ "status": 0, "message": "Stock not found." });
                } else {
                    stock.quantity = (stock.quantity + count);
                    stock.save((err) => {
                        if(err) {
                            resolve({ "status": 0, "message": err });
                        } else {
                            resolve({ "status": 1, "message": "" });
                        }
                    });
                }
            }
        });
    });
};

var Stock = mongoose.model('Stock', StockSchema);
module.exports = Stock;