import { Component, OnInit } from '@angular/core';
import { Order } from '../../classes/order';
import { StockService } from '../../services/stock.service';
import { Stock } from '../../classes/stock';

@Component({
  selector: 'app-wait-area',
  templateUrl: './wait-area.component.html',
  styleUrls: ['./wait-area.component.scss']
})
export class WaitAreaComponent implements OnInit {
    private _order: Order = new Order();
    private _stock: Stock[] = [];
    constructor(
        private stockService: StockService
    ) {
        this.stockService.fetch();
    }
    ngOnInit() {
        this.stockService.stock.subscribe((stock: Stock[]) => this._stock = stock);
    }
    public add(id: string) {
        this._order.add(id);
    }
    public remove(id: string) {
        this._order.remove(id);
    }
    public quantity(id: string): number {
        return this._order.quantity(id);
    }
}
