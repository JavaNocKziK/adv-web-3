import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Order } from '../classes/order';
import { UserService } from './user.service';

const options: RequestOptionsArgs = {
    withCredentials: true
};

@Injectable()
export class OrderService {
    constructor(
        private http: Http,
        private userService: UserService
    ) {}
    public place(order: Order) {
        let content = [];
        order.items.forEach((item) => {
            content.push({
                stockId: item.stockId,
                quantity: item.quantity
            });
        });
        return this.http.post(
            `${environment.api}/order`,
            {
                userId: this.userService.me().id,
                tableId: 'placeholder',
                content: content,
                timeCreated: (new Date()).toJSON()
            },
            options
        ).map((result) => { return result.json(); });
    }
}