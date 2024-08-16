import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPasswordComponent } from './forget-password.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ForgetPasswordComponent }
])],
  exports: [RouterModule]
})
export class ForgetPasswordRoutingModule { }
