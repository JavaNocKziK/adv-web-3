import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Order, OrderItem } from '../../classes/order';
import { OrderService } from '../../services/order.service';
import { Observable } from 'rxjs/Rx';
import { ErrorService } from '../../services/error.service';
import { Tab } from '../../classes/tab';

@Component({
    selector: 'app-counter-area',
    templateUrl: './counter-area.component.html',
    styleUrls: ['./counter-area.component.scss']
})
export class CounterAreaComponent implements OnInit {
    private _errors: string[] = [];
    private _completedOrders: Order[] = [];
    private _selectedOrder: number;
    private _activeTab: number = 0;
    private _tabs: Tab[] = [];
    constructor(
        private errorService: ErrorService,
        private orderService: OrderService,
        private userService: UserService
    ) {
        this._tabs.push(new Tab('Bills', 0));
        this._tabs.push(new Tab('Archived', 1));
        this._tabs.push(new Tab('Reports', 2));
        this.fetchCompletedOrders(); // Initial fetch.
        Observable.interval(120000).subscribe(() => {
            this.fetchCompletedOrders(); // Update every 2 minutes.
        });
        this.errorService.errors.subscribe((result) => {
            this._errors = result;
        });
    }
    ngOnInit() {}
    get hasError(): boolean {
        return (this._errors.length > 0 ? true : false);
    }
    public clearErrors() {
        this.errorService.clear();
    }
    public logout() {
        this.userService.logout();
    }
    private select(index) {
        this._selectedOrder = index;
    }
    private close() {
        this._selectedOrder = undefined;
    }
    public changeTab(index: number) {
        this._activeTab = index;
    }
    private fetchCompletedOrders() {
        this.orderService.many(true, 4, undefined).subscribe((result) => {
            if(result.status == 1) {
                let orders = result.message;
                this._completedOrders = [];
                orders.forEach((order) => {
                    let orderItems: OrderItem[] = [];
                    order.content.forEach((item) => {
                        orderItems.push(new OrderItem(
                            item.stockId,
                            item.quantity,
                            item.stockName,
                            item.totalPrice
                        ));
                    });
                    this._completedOrders.push(new Order(
                        order._id,
                        order.friendlyId,
                        orderItems,
                        order.status,
                        order.tableId,
                        new Date(),
                        order.userId
                    ));
                });
                console.log(this._completedOrders);
            } else {
                this.errorService.add(result.message);
            }
        });
    }
    private pay() {
        let id: string = this._completedOrders[this._selectedOrder].id;
        this.orderService.update(id, {
            status: 5 // Archived
        }).subscribe((result) => {
            if(result.status == 1) {
                this._selectedOrder = undefined;
                this.fetchCompletedOrders();
            } else {
                this.errorService.add(result.message);
            }
        });
    }
}
