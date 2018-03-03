export class Order {
    private _items: OrderItem[] = [];
    constructor() {}
    public add(stock: OrderItem) {
        this._items.push(stock);
    }
    public clear() {
        this._items = [];
    }
}

export class OrderItem {
    public stockId: string;
    public quantity: number;
}