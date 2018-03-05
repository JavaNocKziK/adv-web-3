export class User {
    private _id: string;
    private _username: string;
    private _admin: boolean;
    public token: Token;
    private _homepath: string;
    constructor(id: string, username: string, admin: boolean, homepath: string) {
        this._id = id;
        this._username = username;
        this._admin = admin;
        this._homepath = homepath;
    }
    get home(): string {
        return (this._homepath || '/login');
    }
    get id(): string {
        return this._id;
    }
    get admin(): boolean {
        return this._admin;
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