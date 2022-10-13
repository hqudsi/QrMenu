import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-website',
  templateUrl: './website.page.html',
  styleUrls: ['./website.page.scss'],
})
export class WebsitePage implements OnInit {

  currenctLanguage: string = '';
  // currenctLanguage: string = '';

  constructor(
    private languageService: LanguageService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.currenctLanguage = this.languageService.selected;
  }

  radioChangeLanguage(event) {
    this.popoverController.dismiss();
    this.currenctLanguage = event.detail.value;
    this.languageService.setLanguage(event.detail.value);
    // Reload because our routing is out of place
    window.location.reload();
  }

  radioChangeUser(event) {
    console.log('event.detail.value');
  }

  dismissPopover() {
    this.popoverController.dismiss();
  }

}
