import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';
import { StockService } from '../../services/stock.service';
import { Stock } from '../../classes/stock';
import { OrderService } from '../../services/order.service';
import { Order } from '../../classes/order';


@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.scss']
})
export class AdminAreaComponent implements OnInit {
  private _tabs: Tab[] = [];
  private _users: User[] = [];
  private _stock: Stock[] = [];
  private _orders: Order[] = [];
  private _activeTab: number = 0;
  constructor(
    private userService: UserService,
    private stockService: StockService,
    private orderService: OrderService
  ) {
    this._tabs.push(new Tab('Users', 0));
    this._tabs.push(new Tab('Stock', 1));
    this._tabs.push(new Tab('Orders', 2));
    this.userService.fetch();
    this.stockService.fetch();
    this.orderService.fetch();
  }
  ngOnInit() {
    this.userService.users.subscribe((result: User[]) => {this._users = result});
    this.stockService.stock.subscribe((stock: Stock[]) => {this._stock = stock});
    this.orderService.orders.subscribe((order: Order[]) => {this._orders = order});
  }
  public changeTab(index: number) {
      this._activeTab = index;
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
