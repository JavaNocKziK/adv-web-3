const OrderModel = require('../models/order.model');
const OrderStatusModel = require('../models/orderstatus.model');
const StockModel = require('../models/stock.model');
const UserController = require('../controllers/user.controller');

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
        for(let i = 0; i < order.content.length; i++) {
            let item = order.content[i];
            let result = await StockModel.adjust(item.stockId, -item.quantity);
            if(result.status == 1) {
                stock.taken.push(item);
            } else {
                stock.failed.push(item);
            }
        }
        if(stock.failed.length > 0) {
            // If we have failed stock, rollback.
            await rollback();
            return { "status": 0, "code": 500, "message": "Taking stock failed." };
        } else {
            // Place the order.
            let orderResult = await OrderModel.place(order);
            if(orderResult.status == 1) {
                return orderResult;
            } else {
                await rollback();
                return { "status": 0, "code": 500, "message": "Placing order failed." };
            }
        }
    },
    /**
     * Get a single order from an ID.
     * @param id The order ID.
     */
    single: (id) => {
        return new Promise((resolve) => {
            OrderModel.findById(id, (err1, order) => {
                if (err1) resolve({ "status": 0, "code": 500, "message": "Issue getting order.", "error": err });
                resolve({ "status": 1, "code": 200, "message": order });
            });
        });
    },
    /**
     * Get many orders.
     * @param detail Get stock details (name).
     * @param status Search for an order based on its status.
     * @param timeRange Search for an order based on when it was created.
     * @param size Search for an order based on the number of unique items. (Not implemented).
     * @param items Search for an order that contains one or many items. (Not implemented).
     */
    many: (detail, status, dateRange, friendlyId, size, items) => {
        return new Promise((resolve) => {
            let search = OrderModel.find();
            if (status)         search.where('status').equals(status);
            if (dateRange[0])   search.where('timeCreated').gte(new Date(dateRange[0]));
            if (dateRange[1])   search.where('timeCreated').lte(new Date(dateRange[1]));
            if (friendlyId)     search.where('friendlyId').equals(friendlyId);
            search.exec(async (err1, orders) => {
                if (err1 || !orders) return resolve({ "status": 0, "code": 500, "message": "Issue obtaining orders.", "error": err1 });
                if (!detail) {
                    // Not asking for detail, pass them just the orders.
                    return resolve({ "status": 1, "code": 200, "message": orders });
                } else {
                    // Asking for detail, so we include stock name and price data with the content.
                    for(let a = 0; a < orders.length; a++) {
                        let order = orders[a];
                        for(let b = 0; b < order.content.length; b++) {
                            let item = order.content[b];
                            let result = await (() => {
                                return new Promise((resolve) => {
                                    StockModel.findById(item.stockId, (err2, stock) => {
                                        if (err2 || !stock) return resolve({ "status": 0, "message": err2 });
                                        return resolve({ "status": 1, "message": stock });
                                    });
                                });
                            })();
                            if(result.status == 1) {
                                order.content[b] = {
                                    _id: item._id,
                                    status: item.status,
                                    stockId: item.stockId,
                                    quantity: item.quantity,
                                    stockName: result.message.name,
                                    price: item.price,
                                    totalPrice: (item.price * item.quantity)
                                }
                            } else {
                                return resolve({ "status": 0, "code": 500, "message": "Issue obtaining orders.", "error": err1 });
                            }
                        }
                        // Get users name.
                        let user = await UserController.single(orders[a].userId);
                        if(user.status == 1) {
                            order = {
                                _id: order._id,
                                content: order.content,
                                timeCreated: order.timeCreated,
                                status: order.status,
                                value: order.value,
                                userId: order.userId,
                                userName: user.message.username,
                                tableId: order.tableId,
                                friendlyId: order.friendlyId
                            }
                        } else {

                        }
                        orders[a] = order;
                    }
                    return resolve({ "status": 1, "code": 200, "message": orders });
                }
            });
        });
    },
    /**
     * Update the information stored against a single order.
     * @param id The ID of the order you want the changes to apply to.
     * @param data The changes you want to make to the order.
     */
    updateSingle: (id, data) => {
        return new Promise((resolve) => {
            OrderModel.findById(id, (err1, order) => {
                if (err1 || !order) return resolve({ "status": 0, "code": 500, "message": "Error updating order.", "error": err1 });
                /*
                    We only want them to be able to change content, status and table ID.
                    - timeCreated is auto generated and should not be changed.
                    - value will be automatically calculated and saved when this document is saved.
                    - userId shouldn't be allowed to change, but tableId can because they might move table.
                    - friendlyId definitely shouldn't change.
                */
                if (data.content)   order.content = data.content;
                if (data.status)    order.status = data.status;
                if (data.tableId)   order.tableId = data.tableId;
                order.save((err2) => {
                    if (err2) return resolve({ "status": 0, "code": 500, "message": "Error updating order.", "error": err2 });
                    return resolve({ "status": 1, "code": 200, "message": "" });
                });
            });
        });
    },
    /**
     * Potential future implementation of a function to update
     * many orders as the same time.
     * @param ids A list of IDs you want the update to apply to.
     * @param data The changes you want to make to the orders.
     */
    updateMany: (ids, data) => {
        return new Promise((resolve) => {
            resolve({ "status": 0, "code": 501, "message": "" });
        });
    },
    /**
     * Update a single item under the order. Useful if you want to
     * change the status of an item under the order.
     * @param orderId The ID of the order.
     * @param itemId The ID of the item under the order.
     * @param data The data you want to set.
     */
    updateItem: (orderId, itemId, data) => {
        return new Promise((resolve) => {
            OrderModel.findById(orderId, (err1, order) => {
                if (err1 || !order) return resolve({ "status": 0, "code": 500, "message": "Error updating order.", "error": err1 });
                let index = order.content.findIndex((item) => {
                    return item._id == itemId;
                });
                if(data.status)     order.content[index].status = data.status;
                order.save((err2) => {
                    if (err2 || !order) return resolve({ "status": 0, "code": 500, "message": "Error updating order.", "error": err2 });
                    return resolve({ "status": 1, "code": 200, "message": "" });
                });
            });
        });
    },
    /**
     * Delete a single order.
     * @param id The ID of the order you want to delete.
     */
    deleteSingle: (id) => {
        return new Promise((resolve) => {
            OrderModel.remove({ _id: id }, (err1) => {
                if (err1) return resolve({ "status": 0, "code": 500, "message": "Error deleting order.", "error": err1 });
                return resolve({ "status": 1, "code": 200, "message": "" });
            });
        });
    },
    /**
     * Potential future implementation of a function to delete
     * many orders at the same time.
     * @param ids The IDs of the orders you want to delete.
     */
    deleteMany: (ids) => {
        return new Promise((resolve) => {
            resolve({ "status": 0, "code": 501, "message": "" });
        });
    },
    /**
     * Get a list of valid statuses for orders or items on an order.
     */
    statuses: () => {
        return new Promise((resolve) => {
            OrderStatusModel.find((err1, list) => {
                if (err1 || !list) return resolve({ "status": 0, "code": 500, "message": "Unable to fetch statuses." });
                return resolve({ "status": 1, "code": 200, "message": list });
            });
        });
    }
}
