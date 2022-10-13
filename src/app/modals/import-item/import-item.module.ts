import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImportItemPageRoutingModule } from './import-item-routing.module';

import { ImportItemPage } from './import-item.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImportItemPageRoutingModule,
    TranslateModule
  ],
  declarations: [ImportItemPage]
})
export class ImportItemPageModule {}
