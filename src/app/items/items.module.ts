import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemsPageRoutingModule } from './items-routing.module';

import { ItemsPage } from './items.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedDirectivesModule } from '../directives/shared-directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemsPageRoutingModule,
    TranslateModule,
    SharedDirectivesModule
  ],
  declarations: [ItemsPage]
})
export class ItemsPageModule {}
