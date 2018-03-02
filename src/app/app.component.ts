import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { User, Token } from './classes/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(
        private userService: UserService,
        private router: Router
    ) {
        this.userService.user.subscribe((user) => {
            if(user) {
                // Route to the home area of the user.
                this.router.navigate([user.home()]);
            } else {
                let session: string = sessionStorage.getItem('token');
                if(!session) {
                    // We don't have a user or a session.
                    this.router.navigate(['/login']);
                }
            }
        });
        let session: string = sessionStorage.getItem('token');
        if(session) {
            /*
                we're only here if someone refreshed the web
                page, but also has a session token.
                We're going to check their token to make sure
                it's legitimate and hasn't expired.
            */
            let sessionToken = JSON.parse(session);
            this.userService.reauthenticate(sessionToken.value).subscribe((res) => {
                if(res.status == 1) {
                    let data = res.message;
                    let user = new User(
                        data.id,
                        data.username,
                        data.security
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
