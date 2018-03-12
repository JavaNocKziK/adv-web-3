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
    private _orders: Order[] = [];
    private _selectedOrder: number;
    private _activeTab: number = 0;
    private _tabs: Tab[] = [];
    constructor(
        private errorService: ErrorService,
        private orderService: OrderService,
        private userService: UserService
    ) {
        this._tabs.push(new Tab('Active', 0));
        this._tabs.push(new Tab('Archived', 1));
        this._tabs.push(new Tab('Reports', 2));
        this.fetchOrders(); // Initial fetch.
        Observable.interval(120000).subscribe(() => {
            this.fetchOrders(); // Update every 2 minutes.
        });
        this.orderService.orders.subscribe((orders: Order[]) => {
            this._orders = orders;
        });
    }
    ngOnInit() {}
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
        this._selectedOrder = undefined;
        this._activeTab = index;
    }
    public orders(status: number) {
        return this._orders.filter((value) => {
            return value.status == status;
        });
    }
    get status() {
        switch(this._activeTab) {
            case 0: return 4;
            case 1: return 5;
            default: return 4;
        }
    }
    private fetchOrders() {
        let status: number[] = [4, 5]; // [Completed, Archived]
        this._orders = [];
        status.forEach((value) => {
            this.orderService.fetch(true, value, undefined);
        });
    }
    private pay() {
        let id: string = this.orders(this.status)[this._selectedOrder].id;
        this.orderService.update(id, {
            status: 5 // Archived
        }).subscribe((result) => {
            if(result.status == 1) {
                this._selectedOrder = undefined;
                this.fetchOrders();
            } else {
                this.errorService.add(result.message);
            }
        });
    }
}
