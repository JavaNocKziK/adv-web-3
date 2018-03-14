import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Order, OrderItem } from '../../classes/order';
import { OrderService } from '../../services/order.service';
import { Observable } from 'rxjs/Rx';
import { ErrorService } from '../../services/error.service';
import { Tab } from '../../classes/tab';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../classes/user';

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
    private _fetcher: Subscription;
    private _autofetch: boolean = false;
    private _profilemenu: boolean = false;
    private _user: User;
    constructor(
        private errorService: ErrorService,
        private orderService: OrderService,
        private userService: UserService
    ) {
        this._tabs.push(new Tab('Active', 0));
        this._tabs.push(new Tab('Archived', 1));
        this._tabs.push(new Tab('Reports', 2));
        this.fetchOrders();
        this.toggleFetcher();
        this.orderService.auto.subscribe((active: boolean) => this._autofetch = active);
        this.orderService.orders.subscribe((result: Order[]) => this._orders = result);
    }
    ngOnInit() {
        this.fetchOrders();
        this.userService.user.subscribe((user: User) => this._user = user);
    }
    public logout() {
        this.userService.logout();
    }
    public toggleFetcher() {
        this._autofetch = !this._autofetch;
        this.orderService.setAutoState(this._autofetch);
        if(this._autofetch) {
            this.orderService.setAutoSubscription(
                Observable.interval(1000).subscribe(() => this.fetchOrders())
            );
        }
    }
    public toggleProfileMenu(event: any, state: boolean) {
        if(event !== undefined) {
            event.stopPropagation();
        }
        this._profilemenu = state;
    }
    public navigate(route: string) {
        //
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
    public orders(status: number): Order[] {
        if(this._orders !== undefined) {
            return this._orders.filter((value) => {
                return value.status == status;
            });
        }
        return [];
    }
    get status() {
        switch(this._activeTab) {
            case 0: return 4;
            case 1: return 5;
            default: return 4;
        }
    }
    private fetchOrders() {
        this.orderService.fetch(true, [4, 5], undefined);
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
