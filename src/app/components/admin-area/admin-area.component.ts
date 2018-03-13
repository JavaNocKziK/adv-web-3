import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';
import { StockService } from '../../services/stock.service';
import { Stock } from '../../classes/stock';
import { OrderService } from '../../services/order.service';
import { Order } from '../../classes/order';
import { FormControl, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.scss']
})
export class AdminAreaComponent implements OnInit {
  private _createUserForm: FormGroup;
  private _tabs: Tab[] = [];
  private _users: User[] = [];
  private _stock: Stock[] = [];
  private _orders: Order[] = [];
  private _activeTab: number = 0;
  private _userModal = 0;
  constructor(
    private userService: UserService,
    private stockService: StockService,
    private orderService: OrderService
  ) {
    this._tabs.push(new Tab('Users', 0));
    this._tabs.push(new Tab('Stock', 1));
    this._tabs.push(new Tab('Orders', 2));

    this.userService.fetch();
    this.stockService.fetch();
    this.orderService.fetch();

    this._createUserForm = new FormGroup({
        'username': new FormControl('', [
            Validators.required
        ]),
        'password': new FormControl('', [
            Validators.required
        ]),
        'homePath': new FormControl('', [
            Validators.required
        ]),
        'admin': new FormControl('', [

        ]),
    });
  }
  ngOnInit() {
    this.userService.users.subscribe((result: User[]) => {this._users = result});
    this.stockService.stock.subscribe((stock: Stock[]) => {this._stock = stock});
    this.orderService.orders.subscribe((order: Order[]) => {this._orders = order});
  }
  public changeTab(index: number) {
      this._activeTab = index;
  }
  public modal(modal: string) {
    this._userModal = 1;
  }
  private createUser() {
      if(this._createUserForm.valid) {
          let data = this._createUserForm.value;
          this.userService.create(data.username, data.password, data.homePath, data.admin).subscribe((res) => {
              if(res.status == 1) {
                  let user = new User(
                      res.message.id,
                      data.username,
                      res.message.admin,
                      res.message.homePath
                  );
              }
          });
      }
  }
  private removeUser(id: number) {
    this.userService.remove(id).subscribe((res) => {
        if(res.status == 1) {
            
            );
        }
    });
  }
}

export class Tab {
    public title: string;
    public category: number;
    constructor(title: string, category: number) {
        this.title = title;
        this.category = category;
    }
}
