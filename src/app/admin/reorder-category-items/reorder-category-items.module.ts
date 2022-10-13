import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReorderCategoryItemsPageRoutingModule } from './reorder-category-items-routing.module';

import { ReorderCategoryItemsPage } from './reorder-category-items.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReorderCategoryItemsPageRoutingModule,
    TranslateModule
  ],
  declarations: [ReorderCategoryItemsPage]
})
export class ReorderCategoryItemsPageModule {}
