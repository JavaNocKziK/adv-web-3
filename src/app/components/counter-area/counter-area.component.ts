import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Order, OrderItem } from '../../classes/order';
import { OrderService } from '../../services/order.service';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'app-counter-area',
    templateUrl: './counter-area.component.html',
    styleUrls: ['./counter-area.component.scss']
})
export class CounterAreaComponent implements OnInit {
    private orders: Order[] = [];
    private selected: number;
    constructor(
        private orderService: OrderService,
        private userService: UserService
    ) {
        this.fetchOrders(); // Initial fetch.
        Observable.interval(120000).subscribe(() => {
            this.fetchOrders(); // Update every 2 minutes.
        });
    }
    ngOnInit() {}
    public logout() {
        this.userService.logout();
    }
    private select(index) {
        this.selected = index;
    }
    private close() {
        this.selected = undefined;
    }
    private fetchOrders() {
        this.orderService.many(true, 4, undefined).subscribe((result) => {
            let orders = result.message;
            console.log(orders);
            this.orders = [];
            orders.forEach((order) => {
                let orderItems: OrderItem[] = [];
                order.content.forEach((item) => {
                    orderItems.push(new OrderItem(
                        item.stockId,
                        item.quantity,
                        item.stockName,
                        item.totalPrice
                    ));
                });
                this.orders.push(new Order(
                    order._id,
                    order.friendlyId,
                    orderItems,
                    order.status,
                    order.tableId,
                    new Date(),
                    order.userId
                ));
            });
            console.log(this.orders);
        });
    }
    private pay() {
        let id: string = this.orders[this.selected].id;
        this.orderService.update(id, {
            status: 5 // Archived
        }).subscribe((result) => {
            if(result.status == 1) {
                this.selected = undefined;
                this.fetchOrders();
            }
        });
    }
}
