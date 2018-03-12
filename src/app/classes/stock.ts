export class Stock {
    private _id: string;
    private _name: string;
    private _description: string;
    private _category: number;
    private _quantity: number;
    private _price: number;

    constructor(id: string, name: string, description: string, category: number, quantity: number, price: number) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._category = category;
        this._quantity = quantity;
        this._price = price;
    }
    get id(): string {
        return this._id;
    }
    get name(): string {
        return this._name;
    }
    get categoryString(): string {
        switch(this._category) {
            case 0: return 'Starter';
            case 1: return 'Main';
            case 2: return 'Desert';
            case 3: return 'Drink';
        }
    }
    get category(): number {
        return this._category;
    }

    get price(): number {
        return this._price;
    }

    get quantity(): number {
        return this._quantity;
    }
}
