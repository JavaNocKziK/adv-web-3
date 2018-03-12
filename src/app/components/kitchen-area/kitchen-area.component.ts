import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Order } from '../../classes/order';
import { StockService } from '../../services/stock.service';
import { OrderService } from '../../services/order.service';

// order-items are individual table's orders (e.g. every persons orders)
// Each order-item includes a orderNum, tableNum, and order-content 
// order-content is a div surrounding the order-contents-list
// contents-list-item 


@Component({
  selector: "app-kitchen-area",
  templateUrl: "./kitchen-area.component.html",
  styleUrls: ["./kitchen-area.component.scss"]
})
export class KitchenAreaComponent implements OnInit {
  private _orderId: string;
  private _tableId: string;
  private _order: Order[] = [];
  private _

  constructor(
    private stockService: StockService,
    private orderService: OrderService,
    private userSerivce: UserService
  ) {
      this.orderService.fetch();
  }

  ngOnInit() {
      this.orderService.orders.subscribe((result: Order[]) => { this._order = result; });
  }

//   private getOrderItems() {}

//   private getOrderNum() {}

//   private getTableNum() {}
}
