import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowCatRefPageRoutingModule } from './show-cat-ref-routing.module';

import { ShowCatRefPage } from './show-cat-ref.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowCatRefPageRoutingModule,
    TranslateModule
  ],
  declarations: [ShowCatRefPage]
})
export class ShowCatRefPageModule {}
