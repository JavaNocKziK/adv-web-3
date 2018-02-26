// Uses Express and is just an example
import * as express from 'express';
import { Order } from '../classes/order';
import { OrderController } from '../mongoDB/controllers/order';

const router = express.Router();
// Includes order.ts from controllers

router.route('/add')
    .get((req, res) => {
        console.log('order add');
        let newOrder = new Order(
            req.query.orderId,
            req.query.userId,
            req.query.tableId,
            req.query.content,
            req.query.timeCreated
        );
        console.log(newOrder);

        let controller: OrderController = new OrderController();

        controller.add(newOrder).then((data) => {
            //res.set('Content-Type', data.contentType);
            //res.send(data.contentData);
            res.json({
                message: 'JSON success'
            });
        }).catch((data) => {
            //res.set('Content-Type', data.contentType);
            //res.send(data.contentData);
            res.json({
                message: 'JSON Error'
            });
        });
    });

module.exports = router;