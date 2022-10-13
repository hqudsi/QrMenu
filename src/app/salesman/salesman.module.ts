import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesmanPageRoutingModule } from './salesman-routing.module';

import { SalesmanPage } from './salesman.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesmanPageRoutingModule
  ],
  declarations: [SalesmanPage]
})
export class SalesmanPageModule {}
