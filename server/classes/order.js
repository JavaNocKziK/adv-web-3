class Order {
    constructor(orderId, userId, tableId, content) { 
        this.orderId = (orderId === undefined ? -1 : orderId);
        this.userId = (userId === undefined ? -1 : userId);
        this.tableId = (tableId === undefined ? -1 : tableId);
        this.content = (content === undefined ? [] : content);
        this.timeCreated = new Date().toJSON();
    }
}

module.exports = Order;