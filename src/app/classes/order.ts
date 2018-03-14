export class Order {
    private _id: string;
    private _friendlyId: string;
    private _content: OrderItem[] = [];
    private _status: number;
    private _tableId: string;
    private _timeCreated: Date;
    private _userId: string;
    constructor(id?: string, friendlyId?: string, content?: OrderItem[], status?: number, tableId?: string, timeCreated?: Date, userId?: string) {
        this._id = id;
        this._friendlyId = friendlyId;
        this._content = (content == undefined ? [] : content);
        this._status = status;
        this._tableId = tableId;
        this._timeCreated = timeCreated;
        this._userId = userId;
    }
    public add(itemId: string, itemStockId: string) {
        let index = this.find(itemStockId);
        if (index != -1) {
            this._content[index].quantity++;
        } else {
            this._content.push(new OrderItem(itemId, itemStockId, 1));
        }
    }
    public remove(itemStockId: string) {
        let index = this.find(itemStockId);
        if (index != -1) {
            this._content[index].quantity--;
            if(this._content[index].quantity <= 0) {
                this._content.splice(index, 1);
            }
        }
    }
    public quantity(id: string): number {
        let index = this.find(id);
        if (index != -1) {
            return this._content[index].quantity;
        } else {
            return 0;
        }
    }
    public clear() {
        this._content = [];
    }
    private find(itemStockId: string): number {
        return this._content.findIndex((data) => {
            return data.stockId == itemStockId;
        });
    }
    get items(): OrderItem[] {
        return this._content;
    }
    get id(): string {
        return this._id;
    }
    get tableId(): string {
        return this._tableId;
    }
    get friendlyId(): string {
        return this._friendlyId;
    }
    get status(): number {
        return this._status;
    }
    get total(): number {
        let total = 0;
        this.items.forEach((item) => {
            total += item.totalPrice;
        });
        return (total || 0);
    }
}

export class OrderItem {
    public id: string;
    public stockId: string;
    public stockName: string;
    public quantity: number;
    public totalPrice: number;
    public status: boolean;
    constructor(id: string, stockId: string, quantity: number, stockName?: string, totalPrice?: number, status?: boolean) {
        this.id = id;
        this.stockId = stockId;
        this.quantity = quantity;
        this.stockName = stockName;
        this.totalPrice = totalPrice;
        this.status = status;
    }
}