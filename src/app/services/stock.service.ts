import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Stock } from '../classes/stock';

const options: RequestOptionsArgs = {
    withCredentials: true
};

@Injectable()
export class StockService {
    private stockSource: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);
    public stock = this.stockSource.asObservable();
    constructor(
        private http: Http
    ) {}
    public fetch() {
        (() => {
            return this.http.get(
                `${environment.api}/stock`,
                options
            ).map((result) => { return result.json(); });
        })().subscribe((res) => {
            if(res.status == 1) {
                let stock: Stock[] = [];
                res.message.forEach((data) => {
                    stock.push(new Stock(
                        data._id,
                        data.name,
                        data.detail,
                        data.category,
                        data.quantity
                        data.price
                    ));
                });
                console.log(stock);
                this.stockSource.next(stock);
            }
        });
    }
    public take(id: string, count: number) {
        (() => {
            return this.http.get(
                `${environment.api}/stock/${id}/take/${count}`,
                options
            ).map((result) => { return result.json(); });
        })().subscribe((res) => {
            if(res.status == 1) {
                this.fetch();
            }
        });
    }
}
