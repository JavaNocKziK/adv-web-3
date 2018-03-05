const StockModel = require('../models/stock.model');

module.exports = {
    add: (data) => {
        return new Promise((accept, reject) => {
            let stock = new StockModel(data);
            stock.save((err) => {
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
        });
    },
    get: (id) => {
        return new Promise((accept, reject) => {
            StockModel.findById(id, (err, result) => {
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
            let query = StockModel.find();
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
            StockModel.findById(id, (err, result) => {
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
            StockModel.remove({_id: id}, (err, result) => {
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
    take: (id, count) => {
        return new Promise((accept, reject) => {
            StockModel.take(id, count)
                .then((data) => {
                    accept({
                        "status": 1,
                        "message": data.message
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
    give: (id, count) => {
        return new Promise((accept, reject) => {
            StockModel.give(id, count)
                .then((data) => {
                    accept({
                        "status": 1,
                        "message": data.message
                    });
                })
                .catch((err) => {
                    reject({
                        "status": 0,
                        "message": err
                    });
                });
        });
    }
}