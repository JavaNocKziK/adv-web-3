import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Order, OrderItem } from '../classes/order';
import { OrderStatus } from '../classes/order-status';
import { ErrorService } from './error.service';
import { Subscription } from 'rxjs/Subscription';

const options: RequestOptionsArgs = {
    withCredentials: true
};

@Injectable()
export class OrderService {
    public statuses: OrderStatus[] = [];
    private ordersSource: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
    public orders = this.ordersSource.asObservable();
    private autoSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public auto = this.autoSource.asObservable();
    private autoSubscriptionSource: BehaviorSubject<Subscription> = new BehaviorSubject<Subscription>(null);
    public autoSubscription = this.autoSubscriptionSource.asObservable();
    constructor(
        private http: Http,
        private errorService: ErrorService
    ) {
        this.auto.subscribe((active: boolean) => {
            if(!active) {
                this.autoSubscriptionSource.value.unsubscribe();
                this.autoSubscriptionSource.next(null);
            }
        });
    }
    public setAutoState(value: boolean) {
        this.autoSource.next(value);
    }
    public setAutoSubscription(subscription: Subscription) {
        if(this.autoSubscriptionSource.value) {
            this.ordersSource.next([]);
            this.autoSubscriptionSource.value.unsubscribe();
            this.autoSubscriptionSource.value.remove(this.autoSubscriptionSource.value);
        }
        this.autoSubscriptionSource.next(subscription);
    }
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
    public fetch(detail?: boolean, status?: number|number[], dateRange?: [Date, Date]) {
        let paramDetail: boolean;
        let paramStatus: number|number[];
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
            console.log(result);
            let orders: Order[] = [];
            result.message.forEach((order) => {
                let orderItems: OrderItem[] = [];
                order.content.forEach((item) => {
                    orderItems.push(new OrderItem(
                        item._id,
                        item.stockId,
                        item.quantity,
                        item.stockName,
                        item.totalPrice,
                        item.status
                    ));
                });
                orders.push(new Order(
                    order._id,
                    order.friendlyId,
                    orderItems,
                    order.status,
                    order.tableId,
                    order.timeCreated,
                    order.userId
                ));
            });
            console.log(orders);
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
    public updateItem(orderId: string, itemId: string, data) {
        options.params = {};
        return this.http.put(
            `${environment.api}/order/${orderId}/${itemId}`, data,
            options
        ).map((result) => {
            console.log(result);
            return result.json();
        })
        .catch((error: any) => {
            let response = JSON.parse(error._body);
            this.errorService.add(`${response.message} (${response.error.message})`);
            return Observable.throw(error);
        });
    }
}