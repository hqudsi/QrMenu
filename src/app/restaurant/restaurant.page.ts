import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { DataService } from '../services/data/data.service';
import { FireServiceService } from '../services/fire-service.service';
import { LanguageService } from '../services/language.service';

import algoliasearch from 'algoliasearch';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit {

  cafeId: any;
  cafeData: any;
  types: any;
  categories: any;
  currenctLanguage: string = '';
  segment: string = 'meals';
  svgColor: string = '#000000b3';

  startSearch: boolean = false;
  fitchingData: boolean = false;

  items: any;
  sub1: any;
  sub2: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fireservice: FireServiceService,
    private dataService: DataService,
    private languageService: LanguageService,
    private alertController: AlertController,
    private translatePipe: TranslatePipe
  ) {
    if (this.route.snapshot.params['id']) {
      this.cafeId = this.route.snapshot.params['id'];
    } else {
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
    this.sub1 = this.fireservice.getCafeById(this.cafeId).subscribe(async res => {
      if (res) {
        this.cafeData =  res;
        this.checkAccount();
      } else {
        this.showAlert('ALERTS.expired_request_wrong_id', 'ALERTS.expired_request_wrong_id_detail');
        this.router.navigateByUrl('/', { replaceUrl: true });
      }
    });
    this.sub2 = this.fireservice.getCafeCategories(this.cafeId, this.segment).subscribe(res => {
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

  async search(event) {
    if (event.target.value) {
      this.startSearch = true;
      this.fitchingData = true;
      const query = event.target.value.toLowerCase();
      const client = algoliasearch('VH67RASCNV','6dad6e128825cacc30b1092cc00e1e6a');
      const index = client.initIndex('items');
      let results = (await index.search(query, { filters: `cafe_id:${this.cafeId} AND show:true AND active:true` })).hits;
      this.items = results;
      this.fitchingData = false;
    }
  }

  async inputSearh(event) {
    if (!event.target.value) {
      this.startSearch = false;
      console.log('no data - clear');
    }
  }

  async checkAccount() {
    let today = new Date().setHours(0, 0, 0, 0);
      let endate = new Date(this.cafeData.end_date.toDate()).setHours(0, 0, 0, 0);
      if (today > endate) {
        this.showAlert('ALERTS.expired_request_detail', '');
        this.router.navigateByUrl('/', { replaceUrl: true });
      }
  }

  openItems(category) {
    this.dataService.setData(category.id, {category: category, cafeData: this.cafeData});
    this.router.navigate(['/items/' + category.id]);
  }

  languageChange(event) {
    this.currenctLanguage = event.detail.value;
    this.languageService.setLanguage(event.detail.value);
    // Reload because our routing is out of place
    window.location.reload();
  }

  changeSegment(segment) {
    this.categories = null;
    this.sub2 = this.fireservice.getCafeCategories(this.cafeId, segment).subscribe(res => {
      this.categories = res;
    });
  }

  async showAlert(title, message) {

    const alert = await this.alertController.create({
      header: this.translatePipe.transform(title),
      message: this.translatePipe.transform(message),
      buttons: [this.translatePipe.transform('ALERTS.dismiss')],
      mode:"ios"
    });

    await alert.present();
    await alert.onDidDismiss();
  }

}
