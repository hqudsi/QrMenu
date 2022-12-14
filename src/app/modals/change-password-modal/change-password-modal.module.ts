import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePasswordModalPageRoutingModule } from './change-password-modal-routing.module';

import { ChangePasswordModalPage } from './change-password-modal.page';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePasswordModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [ChangePasswordModalPage],
  providers: [TranslatePipe]
})
export class ChangePasswordModalPageModule {}
