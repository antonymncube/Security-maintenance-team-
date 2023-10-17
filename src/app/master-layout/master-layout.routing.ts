import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterLayoutComponent } from './master-layout.component';
import { UserListComponent } from '../user-list/user-list.component';
import { UserupdateComponent } from '../userupdate/userupdate.component';


const routes: Routes = [
  {
    path: '',
    component: MasterLayoutComponent,
    children: [
      {
        path: 'users',
        component: UserListComponent
      },
      {
        path:"updateuser",
        component:UserupdateComponent
      }

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterLayoutRoutingModule { }
