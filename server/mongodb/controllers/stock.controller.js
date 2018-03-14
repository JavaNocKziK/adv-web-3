const StockModel = require('../models/stock.model');

module.exports = {
    /**
     * Create a new stock item.
     * @param stock The data of the new stock item you want to generate.
     */
    add: (stock) => {
        return new Promise((resolve) => {
            StockModel.create(stock, (err, instance) => {
                if (err) return resolve({ "status": 0, "code": 500, "message": "Error creating stock.", "error": err });
                return resolve({ "status": 1, "code": 200, "message": instance });
            });
        });
    },
    /**
     * Get a single piece of stock from an ID.
     * @param id The stock ID.
     */
    single: (id) => {
        return new Promise((resolve) => {
            StockModel.findOne({ _id: id }, (err1, stock) => {
                if (err1 || !stock) return resolve({ "status": 0, "code": 500, "message": "Invalid stock." });
                return resolve({ "status": 1, "code": 200, "message": stock });
            });
        });
    },
    /**
     * Get many stock items.
     * @param name Search on the name or part of the name.
     * @param category Search for items in a specific category.
     * @param quantity Search for items with a specific quantity. Array [gte, lte].
     */
    many: (name, category, quantity) => {
        return new Promise((resolve) => {
            let search = StockModel.find();
            if (name)           search.where('name').regex(new RegExp(name, 'gi'));
            if (category)       search.where('category').equals(category);
            if (quantity[0])    search.where('quantity').gte(quantity[0]);
            if (quantity[1])    search.where('quantity').lte(quantity[1]);
            search.exec((err1, stock) => {
                if (err1 || !stock) return resolve({ "status": 0, "code": 500, "message": "Issue obtaining stock.", "error": err1 });
                return resolve({ "status": 1, "code": 200, "message": stock });
            });
        });
    },
    /**
     * Update the information stored against a single stock item.
     * @param id The ID of the stock item you want the changes to apply to.
     * @param data The changes you want to make to the stock item.
     */
    updateSingle: (id, data) => {
        return new Promise((resolve) => {
            StockModel.findById(id, (err1, stock) => {
                if (err1 || !stock) return resolve({ "status": 0, "code": 500, "message": "Error updating stock.", "error": err1 });
                stock.set(data);
                stock.save((err2) => {
                    if (err2) return resolve({ "status": 0, "code": 500, "message": "Error updating stock.", "error": err2 });
                    return resolve({ "status": 1, "code": 200, "message": "" });
                });
            });
        });
    },
    /**
     * Potential future implementation of a function to update
     * many stock items as the same time.
     * @param ids A list of IDs you want the update to apply to.
     * @param data The changes you want to make to the stock items.
     */
    updateMany: (ids, data) => {
        return new Promise((resolve) => {
            resolve({ "status": 0, "code": 501, "message": "" });
        });
    },
    deleteSingle: (id) => {
        return new Promise((resolve) => {
            StockModel.remove({ _id: id }, (err) => {
                if (err) return resolve({ "status": 0, "code": 500, "message": "Error deleting stock.", "error": err });
                return resolve({ "status": 1, "code": 200, "message": "" });
            });
        });
    },
    /**
     * Potential future implementation of a function to delete
     * many stock items at the same time.
     * @param ids The IDs of the stock items you want to delete.
     */
    deleteMany: (ids) => {
        return new Promise((resolve) => {
            resolve({ "status": 0, "code": 501, "message": "" });
        });
    }
}
