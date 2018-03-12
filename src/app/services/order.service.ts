import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Order, OrderItem } from '../classes/order';
import { OrderStatus } from '../classes/order-status';
import { ErrorService } from './error.service';

const options: RequestOptionsArgs = {
    withCredentials: true
};

@Injectable()
export class OrderService {
    public statuses: OrderStatus[] = [];
    private ordersSource: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>(undefined);
    public orders = this.ordersSource.asObservable();
    constructor(
        private http: Http,
        private errorService: ErrorService
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
    public fetch(detail?: boolean, status?: number, dateRange?: [Date, Date]) {
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
        (() => {
            return this.http.get(
                `${environment.api}/order`,
                options
            )
            .map((result) => {
                return result.json();
            })
            .catch((error) => {
                let response = JSON.parse(error._body);
                this.errorService.add(response.message);
                return Observable.throw(error);
            });
        })().subscribe((result) => {
            let orders: Order[] = [];
            result.message.forEach((order) => {
                let orderItems: OrderItem[] = [];
                order.content.forEach((item) => {
                    orderItems.push(new OrderItem(
                        item.stockId,
                        item.quantity,
                        item.stockName,
                        item.totalPrice
                    ));
                });
                orders.push(new Order(
                    order._id,
                    order.friendlyId,
                    orderItems,
                    order.status,
                    order.tableId,
                    new Date(),
                    order.userId
                ));
            });
            this.ordersSource.next(orders);
        });
    }
    public update(id: string, data) {
        options.params = {};
        return this.http.put(
            `${environment.api}/order/${id}`,
            {
                status: data.status,
                tableId: data.tableId
            },
            options
        ).map((result) => {
            return result.json();
        })
        .catch((error: any) => {
            let response = JSON.parse(error._body);
            this.errorService.add(`${response.message} (${response.error.message})`);
            return Observable.throw(error);
        });
    }
}