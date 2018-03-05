export class OrderStatus {
    private _id: string;
    private _value: number;
    private _description: string;
    constructor(id: string, value: number, description: string) {
        this._id = id;
        this._value = value;
        this._description = description;
    }
    get id(): string {
        return this._id;
    }
    get value(): number {
        return this._value;
    }
    get description(): string {
        return this._description;
    }
}
