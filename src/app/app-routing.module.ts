import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { WaitAreaComponent } from './components/wait-area/wait-area.component';
import { AdminAreaComponent } from './components/admin-area/admin-area.component'
import { KitchenAreaComponent } from './components/kitchen-area/kitchen-area.component';
import { AppComponent } from './app.component';
import { CounterAreaComponent } from './components/counter-area/counter-area.component';

const routes: Routes = [
    {
        path: '',
        component: AppComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'wait',
        component: WaitAreaComponent
    },
    {
        path: 'admin',
        component: AdminAreaComponent
    },
    {
        path: 'kitchen',
        component: KitchenAreaComponent
    },
    {
        path: 'counter',
        component: CounterAreaComponent
    },
    // Other routes here.
    {
        path: '404',
        component: LoginComponent
    },
    {
        path: '**',
        redirectTo: '/404'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: false})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
