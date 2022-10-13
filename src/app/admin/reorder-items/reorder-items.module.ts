import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReorderItemsPageRoutingModule } from './reorder-items-routing.module';

import { ReorderItemsPage } from './reorder-items.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReorderItemsPageRoutingModule,
    TranslateModule
  ],
  declarations: [ReorderItemsPage]
})
export class ReorderItemsPageModule {}
