export class Order {
    private _items: OrderItem[] = [];
    constructor() {}
    public add(id: string) {
        let index = this.find(id);
        if(index != -1) {
            this._items[index].quantity++;
        } else {
            this._items.push(new OrderItem(id, 1));
        }
    }
    public remove(id: string) {
        let index = this.find(id);
        if(index != -1) {
            this._items[index].quantity--;
            if(this._items[index].quantity <= 0) {
                this._items.splice(index, 1);
            }
        } else {
            this._items.push(new OrderItem(id, 1));
        }
    }
    public quantity(id: string): number {
        let index = this.find(id);
        if(index != -1) {
            return this._items[index].quantity;
        } else {
            return 0;
        }
    }
    public clear() {
        this._items = [];
    }
    private find(id: string): number {
        return this._items.findIndex((data) => {
            return data.stockId == id;
        });
    }
    get items(): OrderItem[] {
        return this._items;
    }
}

export class OrderItem {
    public stockId: string;
    public quantity: number;
    constructor(stockId: string, quantity: number) {
        this.stockId = stockId;
        this.quantity = quantity;
    }
}