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
  cafeData: any;
  days = 0;
  sub: any;
  constructor(
    private router: Router,
    private fireAuth: FireAuthService,
    private languageService: LanguageService,
    private fireservice: FireServiceService
  ) {
    this.sub = this.fireservice.getCafeById(this.fireAuth.cafeUser.cafe_id).subscribe(res => {
      this.cafeData = res;
      this.checkAccount();
    });
  }

  async checkAccount() {
    let today = new Date().setHours(0, 0, 0, 0);
    let endate = new Date(this.cafeData.end_date.toDate()).setHours(0, 0, 0, 0);
    this.days = (endate - today)/(1000*60*60*24);
  }

  ngOnInit() {
    this.currenctLanguage = this.languageService.selected;
    // this.fireAdmin.testAddCity();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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
