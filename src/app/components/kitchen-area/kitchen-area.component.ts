import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Order } from '../../classes/order';
import { StockService } from '../../services/stock.service';
import { OrderService } from '../../services/order.service';
import { Observable } from "rxjs/Rx";

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
  private _toggleRefresh: boolean = false;
  private _autoUpdate;

  constructor(
    private stockService: StockService,
    private orderService: OrderService,
    private userSerivce: UserService
  ) {
      this.orderService.fetch(true);
      this.toggleAutoUpdate(true);
  }

  ngOnInit() {
      this.orderService.orders.subscribe((result: Order[]) => { this._order = result; });
  }

  public toggleAutoUpdate(force?: boolean) {
    this._toggleRefresh = !this._toggleRefresh;
    if(this._toggleRefresh || force) {
      this._autoUpdate = Observable.interval(1000).subscribe(() => {
        this.orderService.fetch(true);
      });
    } else {
      this._autoUpdate.unsubscribe();
    }
  }

  public logout() {
    this.userSerivce.logout();
  }

//   private getOrderItems() {}

//   private getOrderNum() {}

//   private getTableNum() {}
}
