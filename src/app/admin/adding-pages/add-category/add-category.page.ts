import { Component, OnInit } from '@angular/core';
import { ref, Storage, uploadString } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { FireAdminService } from 'src/app/services/fire-admin.service';
import { FireAuthService } from 'src/app/services/fire-auth.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.page.html',
  styleUrls: ['./add-category.page.scss'],
})
export class AddCategoryPage implements OnInit {

  credentials: FormGroup;
  imageDataSource: any;
  types: any;

  imageFormat: any;
  imageBase46: any;
  userType: number = 2;

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private translatePipe: TranslatePipe,
    private fireAuthService: FireAuthService,
    private fireAdmin: FireAdminService,
    private fireStorage: Storage,
    private router: Router
  ) { }

  ngOnInit() {
    this.userType = this.fireAuthService.cafeUser.type;
    this.credentials = this.formBuilder.group({
      cafe_id: ['', []],
      name: ['', [Validators.required]],
      type_id: ['', [Validators.required]],
      notes: [null],
      image_url: ['', []],
      image_path: ['', []],
      create_at: [new Date(),[]],
      update_at: [new Date(),[]],
      defualt_category: [false],
      selected_category: [false],
      order: [99]
    });
    this.loadData();
  }

  loadData() {
    this.types = [
      {name: 'RESTAURANT.meals', id: 'meals'},
      {name: 'RESTAURANT.drinks', id: 'drinks'},
      {name: 'RESTAURANT.desserts', id: 'desserts'},
      {name: 'RESTAURANT.hookahs', id: 'hookahs'},
    ];
    this.credentials.patchValue({ cafe_id: this.fireAuthService.cafeUser.cafe_id });
  }

  async addCategory() {
    this.credentials.patchValue({ create_at: new Date() });
    this.credentials.patchValue({ update_at: new Date() });
    if (this.credentials.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1'
      });
      await loading.present();
      // upload image
      if (this.imageDataSource) {
        const imageURL = `images/category_${new Date().getTime()}.${this.imageFormat}`;
        const imageStorageURL = imageURL.replace(`.${this.imageFormat}`,`_500x500.${this.imageFormat}`);
        const storageRef = ref(this.fireStorage, imageURL);
        uploadString(storageRef, this.imageDataSource, 'data_url')
          .then(async (snapshot) => {
            // await loading.dismiss();
            // Get the download URL
            // https://firebasestorage.googleapis.com/v0/b/qrmenu-act.appspot.com/o/images%2F imageURL ?alt=media
            let fireImageUrl = `https://firebasestorage.googleapis.com/v0/b/qrmenu-act.appspot.com/o/${imageStorageURL.replace('/','%2F')}?alt=media`
            this.credentials.patchValue({ image_url: fireImageUrl });
            this.credentials.patchValue({ image_path: imageStorageURL });
            // add Category ----------------------
            await this.fireAdmin.addCategory(this.credentials.value)
            .then(async result => {
              const delay = ms => new Promise(res => setTimeout(res, ms));
              await delay(2000);
              await loading.dismiss();
              await this.showAlert('ALERTS.add_category', '', 'ok');
              this.router.navigateByUrl('/admin/my-categories', { replaceUrl: true });
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
        // add Category ----------------------
        await this.fireAdmin.addCategory(this.credentials.value)
          .then(async result => {
            await loading.dismiss();
            await this.showAlert('ALERTS.add_category', '', 'ok');
            this.router.navigateByUrl('/admin/my-categories', { replaceUrl: true });
          })
          .catch(async error => {
            this.showAlert('ALERTS.error', 'ALERTS.error', 'close'); // anas
            await loading.dismiss();
          });
        // add Category ----------------------
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
