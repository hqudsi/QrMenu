import { Component, OnInit } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CameraSource, Camera, CameraResultType } from '@capacitor/camera';
import { LoadingController, AlertController, ActionSheetController, Platform, ModalController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data/data.service';
import { FireAdminService } from 'src/app/services/fire-admin.service';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { FireServiceService } from 'src/app/services/fire-service.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.page.html',
  styleUrls: ['./edit-item.page.scss'],
})
export class EditItemPage implements OnInit {

  credentials: FormGroup;
  categories: any;

  item: any;
  sub: any;
  currencies: any;
  userType: number = 2;
  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private translatePipe: TranslatePipe,
    private languageService: LanguageService,
    private platform: Platform,
    private modalController: ModalController,
    private fireservice: FireServiceService,
    private fireAuthService: FireAuthService,
    private fireAdmin: FireAdminService,
    private fireStorage: Storage,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.data['data']) {
      this.item = this.route.snapshot.data['data'].item;
    } else {
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
    this.userType = this.fireAuthService.cafeUser.type;
    this.credentials = this.formBuilder.group({
      currency: ['', [Validators.required]],
      description: ['', []],
      name: ['', [Validators.required]],
      price: [0, [Validators.required]],
      discount_price: [0, []],
      size: ['', []],
      person_number: [0, []],
      preparing_time: [0, []],
      calories: ['', []],
      update_at: [new Date(),[]],
      defualt_item: [false],
      selected_item: [false],
      categories: [null, [Validators.required]],
      multi_category: [false],
      order: [null]
    });
    this.loadData();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  loadData() {
    this.fireservice.getCurrencies().then(res => {
      this.currencies = []
      res.forEach(doc =>{
        this.currencies.push(doc.data());
      });
      this.credentials.patchValue({ currency: this.item.currency });
      console.log(this.currencies);
    }).catch(error => {
      console.log(error);
    });
    this.credentials.patchValue({ description: this.item.description? this.item.description: '' });
    this.credentials.patchValue({ name: this.item.name? this.item.name: '' });
    this.credentials.patchValue({ price: this.item.price? this.item.price: 0 });
    this.credentials.patchValue({ discount_price: this.item.discount_price? this.item.discount_price: 0 });
    this.credentials.patchValue({ size: this.item.size? this.item.size: '' });
    this.credentials.patchValue({ person_number: this.item.person_number? this.item.person_number: 0 });
    this.credentials.patchValue({ preparing_time: this.item.preparing_time? this.item.preparing_time: 0 });
    this.credentials.patchValue({ calories: this.item.calories? this.item.calories: '' });
    this.credentials.patchValue({ defualt_item: this.item.defualt_item? this.item.defualt_item: false });
    this.credentials.patchValue({ selected_item: this.item.selected_item? this.item.selected_item: false });
    this.credentials.patchValue({ multi_category: this.item.multi_category? this.item.multi_category: false });
    this.credentials.patchValue({ order: this.item.order? this.item.order: 99 });
    this.sub = this.fireservice.getCategoriesOfCafe(this.fireAuthService.cafeUser.cafe_id).subscribe(res => {
      this.categories = res;
      this.credentials.patchValue({ categories: this.item.categories? this.item.categories: null });
    });
  }

  async editItem() {
    this.credentials.patchValue({ update_at: new Date() });

    if (this.credentials.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1'
      });
      await loading.present();
      if (this.credentials.get("multi_category").value) {
        this.credentials.patchValue({ order: 99 });
      }
      // add item ----------------------
      await this.fireAdmin.updateItem(this.item.id, this.credentials.value)
      .then(async result => {
        await loading.dismiss();
        await this.showAlert('ALERTS.item_done_update', '', 'ok');
        this.dataService.setData(this.item.id, {item: this.credentials.value});
        this.router.navigateByUrl('/admin/my-items', { replaceUrl: true });
      })
      .catch(async error => {
        this.showAlert('ALERTS.error', 'ALERTS.error', 'close'); // anas
        await loading.dismiss();
      });
      // add item ----------------------

    } else {
      this.showAlert('ALERTS.required_fields', '', 'close');
    }

  }

  changeCategoies() {
    if (this.credentials.get("categories").value.length > 1) {
      this.credentials.patchValue({ multi_category: true });
    } else {
      this.credentials.patchValue({ multi_category: false });
    }
  }

  async showAlert(title, message, button) {

    const alert = await this.alertController.create({
      header: this.translatePipe.transform(title),
      message: this.translatePipe.transform(message),
      buttons: [this.translatePipe.transform(button)],
      mode:"ios"
    });

    await alert.present();
    await alert.onDidDismiss();
  }


}
