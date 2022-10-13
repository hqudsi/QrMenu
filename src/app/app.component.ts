import { Component } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { FireAuthService } from './services/fire-auth.service';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private languageService: LanguageService,
    private fireAuth: Auth,
    private fireAuthService: FireAuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.languageService.setInitialAppLanguage();
  }
}
