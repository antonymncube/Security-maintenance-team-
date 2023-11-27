import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UserListComponent } from './user-list/user-list.component';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MasterLayoutComponent } from './master-layout/master-layout.component';
import { UserupdateComponent } from './userupdate/userupdate.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu'; // Import MatMenuModule directly
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule for MatPrefix
import { MatDialogModule } from '@angular/material/dialog';
import { ModifyAccesCodesComponent } from './modify-acces-codes/modify-acces-codes.component';
import { AccessGroupComponent } from './access-group/access-group.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AvailableProductsComponent } from './available-products/available-products.component';
import { BoddyComponent } from './boddy/boddy.component';
import { WholeBodyComponent } from './whole-body/whole-body.component'; 


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    UserListComponent,
    LoginComponent,
    MasterLayoutComponent,
    UserupdateComponent,
    HomeComponent,
    EditUserComponent,
    ViewUserComponent,
    ModifyAccesCodesComponent,
    AccessGroupComponent,
    ForgotPasswordComponent,
    AvailableProductsComponent,
    BoddyComponent,
    WholeBodyComponent,  
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    HttpClientModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatMenuModule, // Add MatMenuModule to imports
    MatPaginatorModule,
    MatFormFieldModule, // Add MatFormFieldModule to imports for MatPrefix
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule { }
