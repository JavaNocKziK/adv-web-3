import { Order } from '../../classes/order';
//import { OrderModel } from '../models/order';
const OrderModel = require('../models/order');

export class OrderController {
    async add(data: Order): Promise<any> {
        return new Promise((accept, reject) => {
            /*
            let orderModel = new OrderModel();
            orderModel.orderId = data.orderId;
            orderModel.tableId = data.tableId;
            orderModel.userId = data.userId;
            orderModel.content = data.content;
            orderModel.timeCreated = data.timeCreated;
            orderModel.get().save((err) => {
                if(err) {
                    reject({
                        contentType: contentType,
                        contentData: {
                            success: false,
                            message: 'Error adding order.'
                        }
                    });
                } else {
                    accept({
                        contentType: contentType,
                        contentData: {
                            success: true,
                            message: 'Generated order.'
                        }
                    });
                }
            });
            */
            console.log(`data -> ${data}`);
            let model = new OrderModel();
            console.log('after declaration');
            model.orderId = data.orderId;
            model.tableId = data.tableId;
            model.userId = data.userId;
            model.content = data.content;
            model.timeCreated = data.timeCreated;
            console.log('saving');
            model.save(function(err) {
                console.log(`err -> ${err}`);
                if(err) {
                    console.log("rejecting");
                    reject();
                } else {
                    console.log("accepting");
                    accept();
                }
            });
        });
    }
}
