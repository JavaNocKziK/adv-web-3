export class Stock {
    private _name: string;
    private _description: string;
    private _category: number;
    private _quantity: number;
    constructor(name: string, description: string, category, number, quantity: number) {
        this._name = name;
        this._description = description;
        this._category = category;
        this._quantity = quantity;
    }
    get categoryString(): string {
        switch(this._category) {
            case 0: return 'Starter';
            case 1: return 'Main';
            case 2: return 'Desert';
            case 3: return 'Drink';
        }
    }
}
