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
            type: String,
            required: true
        }
    },
    { versionKey: false }
);

StockSchema.statics.take = function take(id, count) {
    return new Promise((accept, reject) => {
        Stock.findById(id, (err, stock) => {
            if(err) {
                reject({
                    "status": 0,
                    "message": err
                });
            } else {
                if(!stock) {
                    reject({
                        "status": 0,
                        "message": "Stock not found."
                    });
                } else {
                    let quantity = (stock.quantity - count);
                    stock.quantity = quantity;
                    stock.save((err) => {
                        if(err) {
                            reject({
                                "status": 0,
                                "message": err
                            });
                        } else {
                            accept({
                                "status": 1,
                                "message": {
                                    "quantity": quantity
                                }
                            });
                        }
                    });
                }
            }
        });
    });
};

var Stock = mongoose.model('Stock', StockSchema);
module.exports = Stock;