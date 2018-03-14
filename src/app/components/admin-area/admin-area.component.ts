import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';
import { StockService } from '../../services/stock.service';
import { Stock } from '../../classes/stock';
import { OrderService } from '../../services/order.service';
import { Order } from '../../classes/order';
import { Status } from '../../classes/status';
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
  private _statuses: Status[] = [];
  private _activeTab: number = 0;
  private _userModal = 0;
  private _stockModal = 0;
  constructor(
    private userService: UserService,
    private stockService: StockService,
    private orderService: OrderService
  ) {
    this._tabs.push(new Tab('Users', 0));
    this._tabs.push(new Tab('Stock', 1));
    this._tabs.push(new Tab('Orders', 2));

    this.userRefresh();
    this.stockRefresh();
    this.orderRefresh();

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
        'admin': new FormControl(false, []),
    });
    this._createStockForm = new FormGroup({
        'name': new FormControl('', [
            Validators.required
        ]),
        'category': new FormControl('', [
            Validators.required
        ]),
        'quantity': new FormControl('', [
            Validators.required
        ]),
        'price': new FormControl('', [
            Validators.required
        ]),
    });
  }
  ngOnInit() {
    this.userService.users.subscribe((result: User[]) => {this._users = result});
    this.stockService.stock.subscribe((stock: Stock[]) => {this._stock = stock});
    this.orderService.orders.subscribe((order: Order[]) => {this._orders = order;});
  }
  public changeTab(index: number) {
      this.userRefresh();
      this.stockRefresh();
      this.orderRefresh();
      this._activeTab = index;
  }
  public userModal(openClose: number) {
    this._userModal = openClose;
  }
  public stockModal(openClose: number) {
    this._stockModal = openClose;
  }
  public logout() {
    this.userService.logout();
  }
  public userRefresh() {
    this.userService.fetch();
  }
  private createUser() {
      if(this._createUserForm.valid) {
          let data = this._createUserForm.value;
          this.userService.create(data.username, data.password, data.homePath, data.admin).subscribe(
              (res) => {
                  this.userRefresh();
                  this.userModal(0);
              },
              (error) => {

              }
          );
      }
  }
  private removeUser(id: number) {
    this.userService.remove(id).subscribe(
        (res) => {
            this.userRefresh();
        },
        (error) => {

        }
    );
}
public stockRefresh() {
  this.stockService.fetch();
}
private createStock() {
    if(this._createStockForm.valid) {
        let data = this._createStockForm.value;
        this.stockService.create(data.name, data.category, data.quantity, data.price).subscribe(
            (res) => {
                this.stockRefresh();
                this.stockModal(0);
            },
            (error) => {

            }
        );
    }
}
private removeStock(id: number) {
  this.stockService.remove(id).subscribe(
      (res) => {
          this.stockRefresh();
      },
      (error) => {

      }
  );
}
public orderRefresh() {
  this.orderService.fetch(true);
}
private removeOrder(id: number) {
  this.orderService.remove(id).subscribe(
      (res) => {
          this.orderRefresh();
      },
      (error) => {

      }
  );
}
private search(event: KeyboardEvent) {
  if (this._activeTab == 0) {
    this.userService.fetch(event.target.value);
  } else if (this._activeTab == 1) {
    this.stockService.fetch(event.target.value);
  } else if (this._activeTab == 2) {
    this.orderService.fetch(true, undefined, undefined, event.target.value);
  }
}
public resolveStatus(value: number): OrderStatus {
  return this.orderService.statuses.find((item) => {
    return item.value == value;
  });

}

export class Tab {
    public title: string;
    public category: number;
    constructor(title: string, category: number) {
        this.title = title;
        this.category = category;
    }
}
