import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User, Token } from '../../classes/user';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    private _loginForm: FormGroup;
    constructor(
        private errorService: ErrorService,
        private userService: UserService
    ) {
        this._loginForm = new FormGroup({
            'username': new FormControl('', [
                Validators.required
            ]),
            'password': new FormControl('', [
                Validators.required
            ])
        });
    }
    ngOnInit() {}
    private login() {
        if(this._loginForm.valid) {
            let data = this._loginForm.value;
            this.userService.login(data.username, data.password).subscribe((res) => {
                if(res.status == 1) {
                    let user = new User(
                        res.message.id,
                        data.username,
                        res.message.admin,
                        res.message.homePath
                    );
                    user.token = new Token(res.message.token, new Date(res.message.tokenExpiry));
                    this.userService.set(user);
                }
            });
        }
    }
    private allow(): boolean {
        return this._loginForm.invalid;
    }
}
