/*
import { mongoose } from 'mongoose';
export class OrderModel {
    private model;
    constructor() {
        let Schema = mongoose.Schema;
        let OrderSchema = new Schema(
            {
                orderId: Number,
                userId: Number,
                tableId: Number,
                content: [Number],
                timeCreated: String
            },
            {
                versionKey: false
            }
        );
        this.model = mongoose.model('Order', OrderSchema);
    }
    public get() {
        return this.model;
    } 
}   
*/
const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let OrderSchema = new Schema(
    {
        orderId: Number,
        userId: Number,
        tableId: Number,
        content: [Number],
        timeCreated: String
    },
    {
        versionKey: false
    }
);

export default mongoose.model('Order', OrderSchema);