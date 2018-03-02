import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
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
            return result.json();
        });
    }
    public logout() {

    }
    public reauthenticate(token: string) {
        return this.http.post(`${environment.api}/user/reauthenticate`, {
            token: token
        }).map((result) => {
            return result.json();
        });
    }
    public clear() {
        this.userSource.next(undefined);
        sessionStorage.removeItem('token');
    }
    public set(user: User) {
        let token = JSON.stringify(user.token);
        if(token) {
            sessionStorage.setItem('token', token);
            this.userSource.next(user);
        }
    }
}
