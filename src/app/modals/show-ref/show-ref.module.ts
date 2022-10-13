import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowRefPageRoutingModule } from './show-ref-routing.module';

import { ShowRefPage } from './show-ref.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowRefPageRoutingModule,
    TranslateModule
  ],
  declarations: [ShowRefPage]
})
export class ShowRefPageModule {}
