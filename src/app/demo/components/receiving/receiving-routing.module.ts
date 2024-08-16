import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceivingComponent } from './receiving.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: ReceivingComponent }
	])],
  exports: [RouterModule]
})
export class ReceivingRoutingModule { }
