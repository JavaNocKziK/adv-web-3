import { Component, OnInit } from '@angular/core';
import { Order, OrderItem } from '../../classes/order';
import { StockService } from '../../services/stock.service';
import { Stock } from '../../classes/stock';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';
import { OrderStatus } from '../../classes/order-status';
import { Tab } from '../../classes/tab';

@Component({
  selector: 'app-wait-area',
  templateUrl: './wait-area.component.html',
  styleUrls: ['./wait-area.component.scss']
})
export class WaitAreaComponent implements OnInit {
    private _order: Order = new Order();
    private _myOrders: Order[] = [];
    private _stock: Stock[] = [];
    private _tabs: Tab[] = [];
    private _activeTab: number = 0;
    private _state: number = 0; // 0 (Taking Order), 1 (Reviewing Order), 2 (Previous Orders)
    private _user: User;
    private _showTables: boolean = false;
    private _tables: Table[] = [];
    private _profilemenu: boolean = false;
    constructor(
        private stockService: StockService,
        private orderService: OrderService,
        private userService: UserService
    ) {
        this._tabs.push(new Tab('Starters', 0));
        this._tabs.push(new Tab('Mains', 1));
        this._tabs.push(new Tab('Deserts', 2));
        this._tabs.push(new Tab('Drinks', 3));
        this._tables.push(new Table('abc123', 1, 'Back corner.'));
        this._tables.push(new Table('def456', 2, 'Back corner.'));
        this._tables.push(new Table('ghi789', 3, 'Side window.'));
        this.stockService.fetch();
        this.orderService.setAutoState(false);
        this.orderService.setAutoSubscription(null);
    }
    ngOnInit() {
        this.stockService.stock.subscribe((stock: Stock[]) => this._stock = stock);
        this.userService.user.subscribe((user: User) => this._user = user);
    }
    public add(itemStockId: string) {
        this._order.add('', itemStockId);
    }
    public remove(id: string) {
        this._order.remove(id);
        if(this._order.items.length == 0) {
            this._state = 0;
        }
    }
    public toggleProfileMenu(event: any, state: boolean) {
        if(event !== undefined) {
            event.stopPropagation();
        }
        this._profilemenu = state;
    }
    public quantity(id: string): number {
        return this._order.quantity(id);
    }
    public changeTab(index: number) {
        this._activeTab = index;
    }
    get list(): Stock[] {
        let category = this._tabs[this._activeTab].category;
        return this._stock.filter((data) => {
            return data.category == category;
        });
    }
    get order(): Readback[] {
        let items: Readback[] = [];
        this._order.items.forEach((data) => {
            let newReadback = new Readback();
            let stockIndex = this._stock.findIndex(stock => stock.id == data.stockId);
            if(stockIndex != -1) {
                newReadback.id = data.stockId;
                newReadback.title = this._stock[stockIndex].name;
                newReadback.quantity = data.quantity;
                items.push(newReadback);
            }
        });
        return items;
    }
    public generate(tableId: string) {
        this._showTables = false;
        this.orderService.place(this._user.id, tableId, this._order).subscribe((result) => {
            if(result.status == 1) {
                this.clear();
            } else {
                // Some kind of error message here.
            }
        });
    }
    public confirm() {
        if(this._order.items.length > 0) {
            this._state = 1;
        }
    }
    public unconfirm() {
        this._state = 0;
    }
    public clear() {
        this._state = 0;
        this._order = new Order();
    }
    public showTables() {
        this._showTables = true;
    }
    public cancelTables() {
        this._showTables = false;
    }
    public toggleOwnOrders() {
        this._state = (this._state == 2 ? 0 : 2);
        if(this._state == 2) {
            this.orderService.forUser(this._user.id).subscribe((result) => {
                this._myOrders = [];
                result.message.forEach((item) => {
                    this._myOrders.push(new Order(
                        item._id,
                        item.friendlyId,
                        [],
                        item.status,
                        item.tableId,
                        item.timeCreated,
                        item.userId
                    ));
                });
            });
        }
    }
    public myOrders(status: number): Order[] {
        return this._myOrders.filter((order) => {
            return order.status == status;
        });
    }
    get orderStatuses(): OrderStatus[] {
        return this.orderService.statuses;
    }
    get pageTitle(): string {
        switch(this._state) {
            case 0: return 'New Order';
            case 1: return 'Confirm';
            case 2: return 'My Orders';
        }
    }
    public logout() {
        this.userService.logout();
    }
}

export class Readback {
    public id: string;
    public title: string;
    public quantity: number;
}

export class Table {
    public id: string;
    public number: number;
    public description: string;
    constructor(id: string, number: number, description: string) {
        this.id = id;
        this.number = number;
        this.description = description;
    }
}
