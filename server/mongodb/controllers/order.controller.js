const OrderModel = require('../models/order.model');
const OrderStatusModel = require('../models/orderstatus.model');

module.exports = {
    add: (data) => {
        return new Promise((accept, reject) => {
            let order = new OrderModel(data);
            OrderModel.nextId()
                .then((id) => {
                    order.friendlyId = id;
                    order.status = 0;
                    order.save((err) => {
                        if(err) {
                            reject({
                                "status": 0,
                                "message": err
                            });
                        } else {
                            accept({
                                "status": 1,
                                "message": data
                            });
                        }
                    });
                })
                .catch((err) => {
                    reject({
                        "status": 0,
                        "message": err
                    });
                });
        });
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