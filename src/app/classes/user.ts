export class User {
    private _id: string;
    private _username: string;
    private _security: number;
    constructor(id: string, username: string, security: number) {
        this._id = id;
        this._username = username;
        this._security = security;
    }
}
