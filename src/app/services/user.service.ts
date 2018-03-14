import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { User } from '../classes/user';
import { ErrorService } from './error.service';
import { OrderService } from './order.service';

const options: RequestOptionsArgs = {
    withCredentials: true
};

@Injectable()
export class UserService {
    private userSource: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);
    public user = this.userSource.asObservable();
    private usersSource: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
    public users = this.usersSource.asObservable();
    constructor(
        private http: Http,
        private errorService: ErrorService,
        private orderService: OrderService
    ) {}
    public create(username: string, password: string, homePaths: string, admin: boolean) {
        return this.http.post(
            `${environment.api}/user`,
            {
                username: username,
                password: password,
                homePaths: homePaths,
                admin: admin
            },
            options
        ).map((result) => {
            return result.json();
        });
    }
    public edit(id: string, username: string, password: string, homePath: string, admin: boolean) {
        return this.http.put(
            `${environment.api}/user/${id}`,
            {
                username: username,
                password: password,
                homePath: homePath,
                admin: admin
            },
            options
        ).map((result) => {
            return result.json();
        });
    }
    public remove(id: number) {
        return this.http.delete(
            `${environment.api}/user/${id}`,
            options
        ).map((result) => {
            return result.json();
        });
    }
    public fetch(userName?: string) {
        let userNameParam: string;
        if (userName)   userNameParam = userName;
        options.params = {
            username: userNameParam,
        };
        (() => {
            return this.http.get(
                `${environment.api}/user`,
                options
            )
            .map((result) => {
                return result.json();
            })
            .catch((error) => {
                if(error.status == 0) {
                    this.errorService.add('Connection error.');
                } else {
                    let response = JSON.parse(error._body);
                    this.errorService.add(response.message);
                }
                return Observable.throw(error);
            });
        })().subscribe((res) => {
            if(res.status == 1) {
              let users: User[] = [];
              res.message.forEach((data) => {
                  users.push(new User(
                      data._id,
                      data.username,
                      data.admin,
                      data.homePaths
                  ));
              });
              this.usersSource.next(users);
            }
        });
    }
    public me(): User {
        return this.userSource.value;
    }
    public login(username: string, password: string) {
        return this.http.post(
            `${environment.api}/user/login`,
            {
                username: username,
                password: password
            },
            options
        ).map((result) => {
            console.log(result);
            return result.json();
        })
        .catch((error) => {
            if(error.status == 0) {
                this.errorService.add('Connection error.');
            } else {
                let response = JSON.parse(error._body);
                this.errorService.add(response.message);
            }
            return Observable.throw(error);
        });
    }
    public logout() {
        (() => {
            let session = JSON.parse(localStorage.getItem('token'));
            return this.http.post(
                `${environment.api}/user/logout`,
                {
                    token: (session.value || '')
                },
                options
            )
            .map((result) => {
                return result.json();
            })
            .catch((error) => {
                if(error.status == 0) {
                    this.errorService.add('Connection error.');
                } else {
                    let response = JSON.parse(error._body);
                    this.errorService.add(response.message);
                }
                return Observable.throw(error);
            });
        })().subscribe((res) => {
            if(res.status == 1) {
                this.clear();
                this.orderService.setAutoState(false);
            }
        });
    }
    public reauthenticate() {
        let session = JSON.parse(localStorage.getItem('token'));
        return this.http.post(
            `${environment.api}/user/reauthenticate`,
            {
                token: (session.value || '')
            },
            options
        ).map((result) => {
            return result.json();
        })
        .catch((error) => {
            if(error.status == 0) {
                this.errorService.add('Connection error.');
            } else {
                let response = JSON.parse(error._body);
                this.errorService.add(response.message);
            }
            return Observable.throw(error);
        });
    }
    public clear() {
        localStorage.removeItem('token');
        this.userSource.next(undefined);
    }
    public set(user: User) {
        let token = JSON.stringify(user.token);
        if(token) {
            localStorage.setItem('token', token);
            this.userSource.next(user);
        }
    }
}
