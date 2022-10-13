import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpenImagePageRoutingModule } from './open-image-routing.module';

import { OpenImagePage } from './open-image.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpenImagePageRoutingModule,
    TranslateModule
  ],
  declarations: [OpenImagePage]
})
export class OpenImagePageModule {}
