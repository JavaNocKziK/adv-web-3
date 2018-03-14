export class User {
    private _id: string;
    private _username: string;
    private _admin: boolean;
    public token: Token;
    private _homepaths: string[] = [];
    constructor(id: string, username: string, admin: boolean, homepaths: string[]) {
        this._id = id;
        this._username = username;
        this._admin = admin;
        this._homepaths = homepaths;
    }
    get home(): string {
        return (this._homepaths[0] || '/login');
    }
    get id(): string {
        return this._id;
    }
    get admin(): boolean {
        return this._admin;
    }
    get homePaths(): string[] {
        return this._homepaths;
    }
    public homePathByIndex(index: number): string {
        return this._homepaths[index];
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