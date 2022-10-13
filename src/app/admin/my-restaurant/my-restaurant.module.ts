import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyRestaurantPageRoutingModule } from './my-restaurant-routing.module';

import { MyRestaurantPage } from './my-restaurant.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyRestaurantPageRoutingModule,
    TranslateModule
  ],
  declarations: [MyRestaurantPage]
})
export class MyRestaurantPageModule {}
