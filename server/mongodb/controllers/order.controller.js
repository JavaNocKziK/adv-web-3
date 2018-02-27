const OrderModel = require('../models/order.model');

module.exports = {
    add: (params) => {
        return new Promise((accept, reject) => {
            let order = new OrderModel(params);
            order.save((err) => {
                if(err) {
                    reject({
                        "status": 0,
                        "message": err
                    });
                } else {
                    accept({
                        "status": 1,
                        "message": ""
                    });
                }
            });
        });
    },
    delete: (params) => {
        // Some other function.
    }
}