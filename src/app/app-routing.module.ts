import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { LoginComponent } from './login/login.component';
import { UserupdateComponent } from './userupdate/userupdate.component';
import { AuthGuard } from './auth.guard';
import { MasterLayoutComponent } from './master-layout/master-layout.component';

const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent,
  },

    {
      path: 'home',
      loadChildren: () => import('./master-layout/master-layout.module').then((m) => m.MasterLayoutModule)
    }
    // path: 'home',
    // component: UserListComponent,
    // canActivate: [authGuard] ,
  ,
  {
    path: 'updateuser',
    component: UserupdateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'master',
    component: MasterLayoutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
