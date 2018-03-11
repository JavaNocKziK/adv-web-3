import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { WaitAreaComponent } from './components/wait-area/wait-area.component';
import { AdminAreaComponent } from './components/admin-area/admin-area.component'
import { AppComponent } from './app.component';

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
