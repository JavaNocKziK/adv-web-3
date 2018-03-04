import { Component, OnInit } from '@angular/core';
import { Order, OrderItem } from '../../classes/order';
import { StockService } from '../../services/stock.service';
import { Stock } from '../../classes/stock';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';

@Component({
  selector: 'app-wait-area',
  templateUrl: './wait-area.component.html',
  styleUrls: ['./wait-area.component.scss']
})
export class WaitAreaComponent implements OnInit {
    private _order: Order = new Order();
    private _stock: Stock[] = [];
    private _tabs: Tab[] = [];
    private _activeTab: number = 0;
    private _state: number = 0; // 0 (Taking Order), 1 (Reviewing Order), 2 (Previous Orders)
    private _user: User;
    constructor(
        private stockService: StockService,
        private orderService: OrderService,
        private userSerivce: UserService
    ) {
        this._tabs.push(new Tab('Starters', 0));
        this._tabs.push(new Tab('Mains', 1));
        this._tabs.push(new Tab('Deserts', 2));
        this._tabs.push(new Tab('Drinks', 3));
        this.stockService.fetch();
    }
    ngOnInit() {
        this.stockService.stock.subscribe((stock: Stock[]) => this._stock = stock);
        this.userSerivce.user.subscribe((user: User) => {
            if(user) {
                this._user = user;
                this.orderService.forUser(this._user.id).subscribe((orders) => {
                    console.log(orders);
                });
            }
        });
    }
    public add(id: string) {
        this._order.add(id);
    }
    public remove(id: string) {
        this._order.remove(id);
        if(this._order.items.length == 0) {
            this._state = 0;
        }
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
    public generate() {
        this.orderService.place(this._user.id, this._order).subscribe((result) => {
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
}

export class Tab {
    public title: string;
    public category: number;
    constructor(title: string, category: number) {
        this.title = title;
        this.category = category;
    }
}

export class Readback {
    public id: string;
    public title: string;
    public quantity: number;
}