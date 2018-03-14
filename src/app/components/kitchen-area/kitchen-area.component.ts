import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Order } from '../../classes/order';
import { StockService } from '../../services/stock.service';
import { OrderService } from '../../services/order.service';
import { Observable } from "rxjs/Rx";
import { Subscription } from 'rxjs/Subscription';
import { AfterContentInit } from '@angular/core/src/metadata/lifecycle_hooks';

// order-items are individual table's orders (e.g. every persons orders)
// Each order-item includes a orderNum, tableNum, and order-content
// order-content is a div surrounding the order-contents-list
// contents-list-item


@Component({
    selector: 'app-kitchen-area',
    templateUrl: './kitchen-area.component.html',
    styleUrls: ['./kitchen-area.component.scss']
})
export class KitchenAreaComponent implements OnInit {
    private _orderId: string;
    private _tableId: string;
    private _order: Order[] = [];
    private _fetcher: Subscription;
    private _autofetch: boolean = false;
    private _profilemenu: boolean = false;
    private _tempModify;
    
    constructor(
        private stockService: StockService,
        private orderService: OrderService,
        private userSerivce: UserService
    ) {
        this.fetch();
        this.toggleFetcher();
        this.orderService.auto.subscribe((active: boolean) => this._autofetch = active);
        this.orderService.orders.subscribe((result: Order[]) => this._order = result);
    }
    ngOnInit() {}
    public toggleFetcher() {
        this._autofetch = !this._autofetch;
        this.orderService.setAutoState(this._autofetch);
        if(this._autofetch) {
            this.orderService.setAutoSubscription(
                Observable.interval(1000).subscribe(() => this.fetch())
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
    public refresh() {
        this.fetch();
    }
    public logout() {
        this.userSerivce.logout();
    }
    public fetch() {
        this.orderService.fetch(true, [0,1,2,3]);
    }
    public updateOrder(orderId: string, status: number) {
        this.orderService.update(orderId, {
            status: status
        }).subscribe(() => {
            this.fetch();
        });
    }
    public updateItem(orderId: string, itemId: string, status: number) {
        this.orderService.updateItem(orderId, itemId, {
            status: status
        }).subscribe((res) => {
            this.fetch();
        });
    }

    //   private getOrderItems() {}

    //   private getOrderNum() {}

    //   private getTableNum() {}
}
