import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WebsitePageRoutingModule } from './website-routing.module';

import { WebsitePage } from './website.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebsitePageRoutingModule,
    TranslateModule
  ],
  declarations: [WebsitePage]
})
export class WebsitePageModule {}
