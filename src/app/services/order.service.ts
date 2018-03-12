import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Order, OrderItem } from '../classes/order';
import { OrderStatus } from '../classes/order-status';



const options: RequestOptionsArgs = {
    withCredentials: true
};

@Injectable()
export class OrderService {
  public statuses: OrderStatus[] = [];
  private ordersSource: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>(
    []
  );
  public orders = this.ordersSource.asObservable();
  public orderItems = this.ordersSource.asObservable();

  constructor(private http: Http) {}

  /**
   * Creates Order array and populates from API
   * @memberof OrderService
   */
  public fetch() {
    (() => {
      return this.http.get(`${environment.api}/order`, options).map(result => {
        return result.json();
      });
    })().subscribe(res => {
      if (res.status == 1) {
        let orders: Order[] = [];
        res.message.forEach(data => {
          let orderItems: OrderItem[] = [];
          data.content.forEach(element => {
            orderItems.push(new OrderItem(
                element.stockId,
                element.quantity
            ));
          });
          orders.push(
            new Order(
                data.friendlyId,
                data.tableId,
                data.userId,
                data.status
            )
          );
        });
        console.log(orders);
        this.ordersSource.next(orders);
      }
    });
  }

  public place(userId: string, tableId: string, order: Order) {
    let content = [];
    order.items.forEach(item => {
      content.push({
        stockId: item.stockId,
        quantity: item.quantity
      });
    });
    return this.http
      .post(
        `${environment.api}/order`,
        {
          userId: userId,
          tableId: tableId,
          content: content
        },
        options
      )
      .map(result => {
        return result.json();
      });
  }
  public forUser(id: string) {
    return this.http
      .get(`${environment.api}/user/${id}/orders`, options)
      .map(result => {
        return result.json();
      });
  }
  public loadStatuses() {
    let statuses: OrderStatus[] = [];
    (() => {
      return this.http
        .get(`${environment.api}/order/statuses`, options)
        .map(result => {
          return result.json();
        });
    })().subscribe(result => {
      result.message.forEach(item => {
        statuses.push(new OrderStatus(item._id, item.value, item.description));
      });
    });
    this.statuses = statuses;
  }
}