import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { FireServiceService } from 'src/app/services/fire-service.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.page.html',
  styleUrls: ['./panel.page.scss'],
})
export class PanelPage implements OnInit {

  currenctLanguage: string = '';

  constructor(
    private router: Router,
    private fireAuth: FireAuthService,
    private languageService: LanguageService,
    private fireservice: FireServiceService
  ) {
  }

  ngOnInit() {
    this.currenctLanguage = this.languageService.selected;
  }

  logout() {
    this.fireAuth.logout();
  }


  aboutPage() {
    this.router.navigateByUrl('about');
  }


  languageChange(event) {
    this.currenctLanguage = event.detail.value;
    this.languageService.setLanguage(event.detail.value);
    // Reload because our routing is out of place
    window.location.reload();
  }

}
