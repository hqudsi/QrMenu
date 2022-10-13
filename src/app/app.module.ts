import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ChangePasswordModalPageModule } from './modals/change-password-modal/change-password-modal.module';
import { ImportCategoryPageModule } from './modals/import-category/import-category.module';
import { ImportItemPageModule } from './modals/import-item/import-item.module';
import { ShowRefPageModule } from './modals/show-ref/show-ref.module';
import { ShowCatRefPageModule } from './modals/show-cat-ref/show-cat-ref.module';
import { OpenImagePageModule } from './modals/open-image/open-image.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideFunctions(() => getFunctions()),
    HttpClientModule,
    TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ChangePasswordModalPageModule,
    ImportCategoryPageModule,
    ImportItemPageModule,
    ShowRefPageModule,
    ShowCatRefPageModule,
    OpenImagePageModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    CallNumber,
    FileOpener
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
