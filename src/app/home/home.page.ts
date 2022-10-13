import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data/data.service';
import { FireServiceService } from '../services/fire-service.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  cafeData: any;
  categories: any;
  currenctLanguage: string = '';
  sub1: any;
  sub2: any;

  constructor(
    private fireservice: FireServiceService,
    private dataService: DataService,
    private router: Router,
    private languageService: LanguageService,
  ) {
    this.sub1 = this.fireservice.getCafeById("OZHL70OleaAA2QSIM1RY").subscribe(res => {
      this.cafeData =  res;
    });

    this.sub2 = this.fireservice.getCategoriesOfCafe("OZHL70OleaAA2QSIM1RY").subscribe(res => {
      this.categories = res;
    });
  }

  ngOnInit() {
    this.currenctLanguage = this.languageService.selected;
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  openItems(category) {
    this.dataService.setData(category.id, {category: category});
    this.router.navigate(['/items/' + category.id]);
  }

  languageChange(event) {
    this.currenctLanguage = event.detail.value;
    this.languageService.setLanguage(event.detail.value);
    // Reload because our routing is out of place
    window.location.reload();
  }

}
