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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WaitAreaComponent,
    AdminAreaComponent
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
    OrderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
