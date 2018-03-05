import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { User, Token } from './classes/user';
import { OrderService } from './services/order.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(
        private userService: UserService,
        private router: Router,
        private orderService: OrderService
    ) {
        this.userService.user.subscribe((user) => {
            console.log(user);
            if(user) {
                // Route to the home area of the user.
                this.router.navigate([user.home]);
                // Fetch all static data:
                this.orderService.loadStatuses();
                console.log(this.orderService.statuses);
            } else {
                let session: string = localStorage.getItem('token');
                if(!session) {
                    // We don't have a user or a session.
                    this.router.navigate(['/login']);
                }
            }
        });
        let session: string = localStorage.getItem('token');
        if(session) {
            /*
                we're only here if someone refreshed the web
                page, but also has a session token.
                We're going to check their token to make sure
                it's legitimate and hasn't expired.
            */
            this.userService.reauthenticate().subscribe((res) => {
                if(res.status == 1) {
                    let sessionToken = JSON.parse(session);
                    let data = res.message;
                    let user = new User(
                        data.id,
                        data.username,
                        data.admin,
                        data.homePath
                    )
                    user.token = new Token(sessionToken.value, sessionToken.expiry);
                    this.userService.set(user);
                } else {
                    // Token isn't valid.
                    this.userService.clear();
                    this.router.navigate(['/login']);
                }
            });
        } else {
            this.router.navigate(['/login']);
        }
    }
    ngOnInit() {}
}
