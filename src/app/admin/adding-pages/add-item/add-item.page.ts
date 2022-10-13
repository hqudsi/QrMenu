import { Component, OnInit } from '@angular/core';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { FireAdminService } from 'src/app/services/fire-admin.service';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { FireServiceService } from 'src/app/services/fire-service.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  credentials: FormGroup;
  imageDataSource: any;
  categories: any;

  imageFormat: any;
  imageBase46: any;
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
    private router: Router
  ) { }

  ngOnInit() {
    this.userType = this.fireAuthService.cafeUser.type;
    this.credentials = this.formBuilder.group({
      active: [true, []],
      show: [true, []],
      cafe_id: ['', []],
      currency: ['', [Validators.required]],
      description: ['', []],
      image_url: ['', []],
      image_path: ['', []],
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      size: ['', []],
      person_number: ['', []],
      preparing_time: ['', []],
      calories: ['', []],
      discount_price: ['', []],
      create_at: [new Date(), []],
      update_at: [new Date(), []],
      defualt_item: [false],
      selected_item: [false],
      order: [99],
      categories: [null, [Validators.required]],
      multi_category: [false]
    });
    this.loadData();
  }

  loadData() {
    this.fireservice.getCurrencies().then(res => {
      this.currencies = []
      res.forEach(doc =>{
        this.currencies.push(doc.data());
      });
      console.log(this.currencies);
    }).catch(error => {
      console.log(error);
    });
    this.credentials.patchValue({ cafe_id: this.fireAuthService.cafeUser.cafe_id });
    this.sub = this.fireservice.getCategoriesOfCafe(this.fireAuthService.cafeUser.cafe_id).subscribe(res => {
      this.categories = res;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async addItem() {
    this.credentials.patchValue({ create_at: new Date() });
    this.credentials.patchValue({ update_at: new Date() });
    if (this.credentials.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1'
      });
      await loading.present();
      // upload image
      if (this.imageDataSource) {
        const imageURL = `images/item_${new Date().getTime()}.${this.imageFormat}`;
        const imageStorageURL = imageURL.replace(`.${this.imageFormat}`, `_500x500.${this.imageFormat}`);
        const storageRef = ref(this.fireStorage, imageURL);
        uploadString(storageRef, this.imageDataSource, 'data_url')
          .then(async (snapshot) => {
            // await loading.dismiss();
            // Get the download URL
            // https://firebasestorage.googleapis.com/v0/b/qrmenu-act.appspot.com/o/images%2F imageURL ?alt=media
            let fireImageUrl = `https://firebasestorage.googleapis.com/v0/b/qrmenu-act.appspot.com/o/${imageStorageURL.replace('/', '%2F')}?alt=media`
            this.credentials.patchValue({ image_url: fireImageUrl });
            this.credentials.patchValue({ image_path: imageStorageURL });
            // add item ----------------------
            await this.fireAdmin.addItem(this.credentials.value)
              .then(async result => {
                const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(2000);
                await loading.dismiss();
                await this.showAlert('ALERTS.add_item', '', 'ok'); // anas
                this.router.navigateByUrl('/admin/my-items', { replaceUrl: true });
              })
              .catch(async error => {
                this.showAlert('ALERTS.error', 'ALERTS.error', 'close'); // anas
                await loading.dismiss();
              });
          })
          .catch(async (error) => {
            console.log('error');
            await loading.dismiss();
          });
      } else {
        // add item ----------------------
        await this.fireAdmin.addItem(this.credentials.value)
          .then(async result => {
            await loading.dismiss();
            await this.showAlert('ALERTS.add_item', '', 'ok');
            this.router.navigateByUrl('/admin/my-items', { replaceUrl: true });
          })
          .catch(async error => {
            this.showAlert('ALERTS.error', 'ALERTS.error', 'close'); // anas
            await loading.dismiss();
          });
        // add item ----------------------
      }

    } else {
      this.showAlert('ALERTS.required_fields', '', 'close');
    }

  }

  async selectImageSource() {
    let buttons = [
      {
        text: this.translatePipe.transform('Take_Photo'),
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        }
      },
      {
        text: this.translatePipe.transform('Choose_Photos'),
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
        }
      }
    ];

    if (this.imageDataSource) {
      buttons.push(
        {
          text: this.translatePipe.transform('Delete_Photo'),
          icon: 'trash',
          handler: () => {
            this.deleteImage();
          }
        });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translatePipe.transform('Select_Source'),
      buttons
    });
    await actionSheet.present();
  }

  deleteImage() {
    this.imageDataSource = null;
  }

  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 70,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      width: 400,
      height: 400,
      preserveAspectRatio: true,
      source
    });
    const imageData = 'data:image/' + image.format + ';base64,' + image.base64String;

    this.imageDataSource = imageData;
    this.imageFormat = image.format;
    this.imageBase46 = image.base64String;
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
      mode: "ios"
    });

    await alert.present();
    await alert.onDidDismiss();
  }
}
