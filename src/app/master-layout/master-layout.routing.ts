import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterLayoutComponent } from './master-layout.component';
import { UserListComponent } from '../user-list/user-list.component';
import { UserupdateComponent } from '../userupdate/userupdate.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { ViewUserComponent } from '../view-user/view-user.component';



const routes: Routes = [
  {
    path: '',
    component: MasterLayoutComponent ,
    children: [
      {
        path: '',
        component: UserListComponent
      },
      {
        path:'updateuser',
        component:UserupdateComponent
      },
      {
        path:'edituser/:id',
        component:EditUserComponent
      }
      ,
      {
        path:'viewuser/:id',
        component:ViewUserComponent
      }

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterLayoutRoutingModule { }
