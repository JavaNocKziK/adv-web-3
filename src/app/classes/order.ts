export class Order {
    private _id: string;
    private _friendlyId: string;
    private _content: OrderItem[] = [];
    private _status: number;
    private _tableId: string;
    private _timeCreated: Date;
    private _userId: string;
    private _userName: string;
    constructor(id?: string, friendlyId?: string, content?: OrderItem[], status?: number, tableId?: string, timeCreated?: Date, userId?: string, userName: string) {
        this._id = id;
        this._friendlyId = friendlyId;
        this._content = (content == undefined ? [] : content);
        this._status = status;
        this._tableId = tableId;
        this._timeCreated = timeCreated;
        this._userId = userId;
        this._userName = userName;
    }
    public add(id: string) {
        let index = this.find(id);
        if(index != -1) {
            this._content[index].quantity++;
        } else {
            this._content.push(new OrderItem(id, 1));
        }
    }
    public remove(id: string) {
        let index = this.find(id);
        if(index != -1) {
            this._content[index].quantity--;
            if(this._content[index].quantity <= 0) {
                this._content.splice(index, 1);
            }
        } else {
            this._content.push(new OrderItem(id, 1));
        }
    }
    public quantity(id: string): number {
        let index = this.find(id);
        if(index != -1) {
            return this._content[index].quantity;
        } else {
            return 0;
        }
    }
    public clear() {
        this._content = [];
    }
    private find(id: string): number {
        return this._content.findIndex((data) => {
            return data.stockId == id;
        });
    }
    get items(): OrderItem[] {
        return this._content;
    }
    get id(): string {
        return this._id;
    }
    get friendlyId(): string {
        return this._friendlyId;
    }
    get friendlyDate(): string {
        return this._timeCreated.toLocaleString("en-GB");
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

    get userName(): string {
      return this._userName;
    }
}

export class OrderItem {
    public stockId: string;
    public stockName: string;
    public quantity: number;
    public totalPrice: number;
    constructor(stockId: string, quantity: number, stockName?: string, totalPrice?: number) {
        this.stockId = stockId;
        this.quantity = quantity;
        this.stockName = stockName;
        this.totalPrice = totalPrice;
    }
}
