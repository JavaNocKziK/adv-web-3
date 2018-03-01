import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    private _loginForm: FormGroup;
    private _error: string = "";
    constructor(
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
        this.userService.user.subscribe((res) => {
            console.log('Logged in as:');
            console.log(res);
        });
    }
    ngOnInit() {}
    private login() {
        if(this._loginForm.valid) {
            let data = this._loginForm.value;
            this.userService.login(data.username, data.password).subscribe((res) => {
                if(res.status == 1) {
                    this.userService.set(new User(
                        res.message.security,
                        data.username,
                        res.message.security
                    ));
                } else {
                    this._error = res.message;
                }
            });
        }
    }
    private allow(): boolean {
        return this._loginForm.invalid;
    }
    private hasError(): boolean {
        return !(!this._error);
    }
}
