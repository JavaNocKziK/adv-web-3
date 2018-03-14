import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';
import { StockService } from '../../services/stock.service';
import { Stock } from '../../classes/stock';
import { OrderService } from '../../services/order.service';
import { Order } from '../../classes/order';
import { ErrorService } from '../../services/error.service';
import { FormControl, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderStatus } from '../../classes/order-status';


@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.scss']
})
export class AdminAreaComponent implements OnInit {
  private _editUserForm: FormGroup;
  private _createUserForm: FormGroup;
  private _createStockForm: FormGroup;
  private _editStockForm: FormGroup;
  private _tabs: Tab[] = [];
  private _users: User[] = [];
  private _stock: Stock[] = [];
  private _orders: Order[] = [];
  private _statuses: OrderStatus[] = [];
  private _activeTab: number = 0;
  private _userModal = 0;
  private _userEditModal = 0;
  private _stockModal = 0;
  private _stockEditModal = 0;
  private _profilemenu: boolean = false;
  private _user: User;
  constructor(
    private userService: UserService,
    private stockService: StockService,
    private orderService: OrderService,
    private errorService: ErrorService
  ) {
    this._tabs.push(new Tab('Users', 0, 'Username', 'text'));
    this._tabs.push(new Tab('Stock', 1, 'Name', 'text'));
    this._tabs.push(new Tab('Orders', 2, 'ID', 'number'));

    this.orderService.setAutoState(false);
    this.orderService.setAutoSubscription(null);

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
    this._editUserForm = new FormGroup({
        'id': new FormControl('', [
            Validators.required
        ]),
        'username': new FormControl('', [
            Validators.required
        ]),
        'password': new FormControl('', []),
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
    this._editStockForm = new FormGroup({
        'id': new FormControl('', [
            Validators.required
        ]),
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
    this.userService.user.subscribe((user: User) => this._user = user);
  }
  public toggleProfileMenu(event: any, state: boolean) {
      if(event !== undefined) {
          event.stopPropagation();
      }
      this._profilemenu = state;
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
  public userEditModal(openClose: number, userId?: number) {
    if (userId) {
      this._editUserForm.controls['id'].setValue(userId);
      /*
      this._editUserForm.controls['username'].setValue(this._users.find(x => x.id === userId)._username);
      this._editUserForm.controls['password'].setValue(this._users.find(x => x.id === userId)._password);
      this._editUserForm.controls['homePath'].setValue(this._users.find(x => x.id === userId)._homepath);
      this._editUserForm.controls['admin'].setValue(this._users.find(x => x.id === userId)._admin);
      */
    }
    this._userEditModal = openClose;
  }
  public stockEditModal(openClose: number, stockId?: number) {
    if (stockId) {
      this._editStockForm.controls['id'].setValue(stockId);
      /*
      this._editStockForm.controls['name'].setValue(this._stock.find(x => x.id === stockId)._name);
      this._editStockForm.controls['category'].setValue(this._stock.find(x => x.id === stockId)._category);
      this._editStockForm.controls['quantity'].setValue(this._stock.find(x => x.id === stockId)._quantity);
      this._editStockForm.controls['price'].setValue(this._stock.find(x => x.id === stockId)._price);
      */
    }
    this._stockEditModal = openClose;
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
  private editUser() {
      if(this._editUserForm.valid) {
          let data = this._editUserForm.value;
          this.userService.edit(data.id, data.username, data.password, data.homePath, data.admin).subscribe(
              (res) => {
                  this.userRefresh();
                  this.userEditModal(0);
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
private editStock() {
    if(this._editStockForm.valid) {
        let data = this._editStockForm.value;
        this.stockService.edit(data.id, data.name, data.category, data.quantity, data.price).subscribe(
            (res) => {
                this.stockRefresh();
                this.stockEditModal(0);
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
      let id = Number(event.target.value);
      if (!isNaN(id)) {
        this.orderService.fetch(true, undefined, undefined, id);
      }
    }
}
public resolveStatus(value: number): OrderStatus {
  return this.orderService.statuses.find((item) => {
    return item.value == value;
  });

}
}

export class Tab {
    public title: string;
    public category: number;
    public searchBy: string;
    public type: string;
    constructor(title: string, category: number, searchBy: string, type: string) {
        this.title = title;
        this.category = category;
        this.searchBy = searchBy;
        this.type = type;
    }
}
