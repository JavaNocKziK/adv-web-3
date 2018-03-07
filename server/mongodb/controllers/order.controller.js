const OrderModel = require('../models/order.model');
const OrderStatusModel = require('../models/orderstatus.model');
const StockModel = require('../models/stock.model');

module.exports = {
    /**
     * Add a new order to the system.
     * @param order The order data you want to add.
     */
    add: async (order) => {
        let stock = {
            taken: [],
            failed: []
        }
        let rollback = async () => {
            for(let i = 0; i < stock.taken.length; i++) {
                let item = stock.taken[i];
                await StockModel.adjust(item.stockId, item.quantity);
            }
        }
        // Take stock.
        await (async () => {
            for(let i = 0; i < order.content.length; i++) {
                let item = order.content[i];
                let result = await StockModel.adjust(item.stockId, -item.quantity);
                if(result.status == 1) {
                    stock.taken.push(item);
                } else {
                    stock.failed.push(item);
                }
            }
        })();
        if(stock.failed.length > 0) {
            // If we have failed stock, rollback.
            await rollback();
            return { "status": 0, "message": "Taking stock failed." };
        } else {
            // Place the order.
            order.friendlyId = await OrderModel.nextId();
            order.status = 0;
            let orderResult = await OrderModel.place(order);
            if(orderResult.status == 1) {
                return orderResult;
            } else {
                await rollback();
                return { "status": 0, "message": "Placing order failed." };
            }
        }
    },
    get: (id) => {
        return new Promise((accept, reject) => {
            OrderModel.findById(id, (err, result) => {
                if(err) {
                    reject({
                        "status": 0,
                        "message": err
                    });
                } else {
                    accept({
                        "status": 1,
                        "message": result
                    });
                }
            });
        });
    },
    list: () => {
        return new Promise((accept, reject) => {
            let query = OrderModel.find();
            query.exec((err, result) => {
                if(err) {
                    reject({
                        "status": 0,
                        "message": err
                    });
                } else {
                    accept({
                        "status": 1,
                        "message": result
                    });
                }
            });
        });
    },
    forUser: (userId) => {
        return new Promise((accept, reject) => {
            let query = OrderModel.find({ userId: userId });
            query.exec((err, result) => {
                if(err) {
                    reject({
                        "status": 0,
                        "message": err
                    });
                } else {
                    accept({
                        "status": 1,
                        "message": result
                    });
                }
            });
        });
    },
    update: (id, data) => {
        return new Promise((accept, reject) => {
            OrderModel.findById(id, (err, result) => {
                if(err) {
                    reject({
                        "status": 0,
                        "message": err
                    });
                } else {
                    result.set(data);
                    result.save((err) => {
                        if(err) {
                            reject({
                                "status": 0,
                                "message": err
                            });
                        } else {
                            accept({
                                "status": 1,
                                "message": result
                            });
                        }
                    });
                }
            });
        });
    },
    delete: (id) => {
        return new Promise((accept, reject) => {
            OrderModel.remove({_id: id}, (err, result) => {
                if(err) {
                    reject({
                        "status": 0,
                        "message": err
                    });
                } else {
                    accept({
                        "status": 1,
                        "message": result
                    });
                }
            });
        });
    },
    statuses: () => {
        return new Promise((accept, reject) => {
            OrderStatusModel.find((err, result) => {
                if(err) {
                    reject({
                        "status": 0,
                        "message": err
                    });
                } else {
                    accept({
                        "status": 1,
                        "message": result
                    });
                }
            });
        });
    }
}