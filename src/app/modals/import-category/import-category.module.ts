import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImportCategoryPageRoutingModule } from './import-category-routing.module';

import { ImportCategoryPage } from './import-category.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImportCategoryPageRoutingModule,
    TranslateModule
  ],
  declarations: [ImportCategoryPage]
})
export class ImportCategoryPageModule {}
