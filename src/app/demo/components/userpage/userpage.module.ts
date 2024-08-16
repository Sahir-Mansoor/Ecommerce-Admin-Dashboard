import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserpageRoutingModule } from './userpage-routing.module';
import { FormsModule } from '@angular/forms';
import { UserpageComponent } from './userpage.component';


@NgModule({
  declarations: [UserpageComponent
  ],
  imports: [
    CommonModule,
    UserpageRoutingModule,
    FormsModule
  ]
})
export class UserpageModule { }
