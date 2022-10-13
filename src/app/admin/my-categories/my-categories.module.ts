import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyCategoriesPageRoutingModule } from './my-categories-routing.module';

import { MyCategoriesPage } from './my-categories.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyCategoriesPageRoutingModule,
    TranslateModule
  ],
  declarations: [MyCategoriesPage]
})
export class MyCategoriesPageModule {}
