import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountRequestPageRoutingModule } from './account-request-routing.module';

import { AccountRequestPage } from './account-request.page';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountRequestPageRoutingModule,
    TranslateModule
  ],
  declarations: [AccountRequestPage],
  providers: [TranslatePipe]
})
export class AccountRequestPageModule {}
