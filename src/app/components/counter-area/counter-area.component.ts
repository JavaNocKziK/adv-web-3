import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Order, OrderItem } from '../../classes/order';
import { OrderService } from '../../services/order.service';
import { Observable } from 'rxjs/Rx';
import { ErrorService } from '../../services/error.service';
import { Tab } from '../../classes/tab';
import { Subscription } from 'rxjs/Subscription';

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
    constructor(
        private errorService: ErrorService,
        private orderService: OrderService,
        private userService: UserService
    ) {
        this._tabs.push(new Tab('Active', 0));
        this._tabs.push(new Tab('Archived', 1));
        this._tabs.push(new Tab('Reports', 2));
        this.toggleFetcher();
        this.orderService.orders.subscribe((orders: Order[]) => {
            if(orders) {
                this._orders = orders;
                if(this._selectedOrder > this._orders.length) {
                    this._selectedOrder = undefined;
                }
            }
        });
    }
    ngOnInit() {
        this.fetchOrders();
    }
    public logout() {
        this.userService.logout();
    }
    public toggleFetcher() {
        this._autofetch = !this._autofetch;
        if(this._autofetch) {
            this._fetcher = Observable.interval(10000).subscribe(() => this.fetchOrders()); // Autofetch.
        } else {
            this._fetcher.unsubscribe();
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
