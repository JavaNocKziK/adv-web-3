import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { User } from '../classes/user';

@Injectable()
export class UserService {
    private userSource: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);
    public user = this.userSource.asObservable();
    constructor(
        private http: Http
    ) {}
    public login(username: string, password: string) {
        return this.http.post(`${environment.api}/user/login`, {
            username: username,
            password: password
        }).map((result) => {
            return result.json()
        });
    }
    public logout() {

    }
    public set(user: User) {
        this.userSource.next(user);
    }
}
