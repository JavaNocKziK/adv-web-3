export class User {
    private _id: string;
    private _username: string;
    private _security: number;
    public token: Token;
    constructor(id: string, username: string, security: number) {
        this._id = id;
        this._username = username;
        this._security = security;
    }
    public home(): string {
        switch(Number(this._security)) {
            case 0: return '/login';
            case 1: return '/wait';
            default: return '/login';
        }
    }
    get id(): string {
        return this._id;
    }
}

export class Token {
    public value: string;
    public expiry: Date;
    constructor(token: string, expiry: Date) {
        this.value = token;
        this.expiry = expiry;
    }
}