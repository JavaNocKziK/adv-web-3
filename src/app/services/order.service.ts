import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Order } from '../classes/order';
import { OrderStatus } from '../classes/order-status';

const options: RequestOptionsArgs = {
    withCredentials: true
};

@Injectable()
export class OrderService {
    public statuses: OrderStatus[] = [];
    constructor(
        private http: Http
    ) {}
    public place(userId: string, tableId: string, order: Order) {
        options.params = {};
        let content = [];
        order.items.forEach((item) => {
            content.push({
                stockId: item.stockId,
                quantity: item.quantity
            });
        });
        return this.http.post(
            `${environment.api}/order`,
            {
                userId: userId,
                tableId: tableId,
                content: content
            },
            options
        ).map((result) => {
            return result.json();
        });
    }
    public forUser(id: string) {
        options.params = {};
        return this.http.get(
            `${environment.api}/user/${id}/orders`,
            options
        ).map((result) => { return result.json(); });
    }
    public loadStatuses() {
        options.params = {};
        let statuses: OrderStatus[] = [];
        (() => {
            return this.http.get(
                `${environment.api}/order/statuses`,
                options
            ).map((result) => { return result.json(); });
        })().subscribe((result) => {
            result.message.forEach((item) => {
                statuses.push(new OrderStatus(
                    item._id,
                    item.value,
                    item.description
                ));
            });
        });
        this.statuses = statuses;
    }
    public many(detail?: boolean, status?: number, dateRange?: [Date, Date]) {
        let paramDetail: boolean;
        let paramStatus: number;
        let paramDateFrom: string;
        let paramDateTo: string;
        if (detail)         paramDetail = detail;
        if (status)         paramStatus = status;
        if (dateRange) {
            if (dateRange[0])   paramDateFrom = dateRange[0].toJSON();
            if (dateRange[1])   paramDateFrom = dateRange[1].toJSON();
        }
        options.params = {
            detail: paramDetail,
            status: paramStatus,
            dateFrom: paramDateFrom,
            dateTo: paramDateTo
        };
        return this.http.get(
            `${environment.api}/order`,
            options
        ).map((result) => { return result.json(); });
    }
}