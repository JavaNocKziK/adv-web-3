import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { StockService } from './services/stock.service';
import { UserService } from './services/user.service';
import { WaitAreaComponent } from './components/wait-area/wait-area.component';
import { OrderService } from './services/order.service';
import { AdminAreaComponent } from './components/admin-area/admin-area.component';
import { KitchenAreaComponent } from './components/kitchen-area/kitchen-area.component';
import { CounterAreaComponent } from './components/counter-area/counter-area.component';
import { ErrorService } from './services/error.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WaitAreaComponent,
    AdminAreaComponent,
    KitchenAreaComponent,
    CounterAreaComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    UserService,
    StockService,
    OrderService,
    ErrorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
