import { Component, OnInit } from '@angular/core';
import { deleteObject, ref, Storage, uploadString } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { FireAdminService } from 'src/app/services/fire-admin.service';

@Component({
  selector: 'app-edit-restaurant',
  templateUrl: './edit-restaurant.page.html',
  styleUrls: ['./edit-restaurant.page.scss'],
})
export class EditRestaurantPage implements OnInit {

  cafeData: any;
  credentials: FormGroup;

  avatarDataSource: any;
  avatarFormat: any;
  avatarBase46: any;


  coverDataSource: any;
  coverFormat: any;
  coverBase46: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private fireAdmin: FireAdminService,
    private alertController: AlertController,
    private translatePipe: TranslatePipe,
    private actionSheetCtrl: ActionSheetController,
    private fireStorage: Storage
  ) { }

  ngOnInit() {
    if (this.route.snapshot.data['data']) {
      this.cafeData = this.route.snapshot.data['data'].cafeData;
    } else {
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
    this.credentials = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      wifi: ['', [Validators.required]],
      facebook: ['', []],
      whatsapp: ['', []],
      instagram: ['', []],
      snapchat: ['', []],
      tiktok: ['', []],
      website: ['', []],
    });
    this.loadData();
  }

  loadData() {
    this.credentials.patchValue({ name: this.cafeData.name? this.cafeData.name: '' });
    this.credentials.patchValue({ address: this.cafeData.address? this.cafeData.address: '' });
    this.credentials.patchValue({ phone: this.cafeData.phone? this.cafeData.phone: '' });
    this.credentials.patchValue({ wifi: this.cafeData.wifi? this.cafeData.wifi: '' });
    this.credentials.patchValue({ facebook: this.cafeData.facebook? this.cafeData.facebook: '' });
    this.credentials.patchValue({ whatsapp: this.cafeData.whatsapp? this.cafeData.whatsapp: '' });
    this.credentials.patchValue({ instagram: this.cafeData.instagram? this.cafeData.instagram: '' });
    this.credentials.patchValue({ snapchat: this.cafeData.snapchat? this.cafeData.snapchat: '' });
    this.credentials.patchValue({ tiktok: this.cafeData.tiktok? this.cafeData.tiktok: '' });
    this.credentials.patchValue({ website: this.cafeData.website? this.cafeData.website: '' });
    this.avatarDataSource = this.cafeData.avatar_url;
    this.coverDataSource = this.cafeData.cover_url;
  }


  async editData() {
    if (this.credentials.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1',
        message: this.translatePipe.transform('ALERTS.loading') // t-anas
      });
      await loading.present();
      // edit restaurant ----------------------
      console.log(this.credentials.value);
      await this.fireAdmin.updateCafe(this.cafeData.id, this.credentials.value)
      .then(async result => {
        await loading.dismiss();
        // upload avatar
        if (this.cafeData.avatar_url != this.avatarDataSource) {
          await this.uploadAvatar();
        }
        // upload cover
        if (this.cafeData.cover_url != this.coverDataSource) {
          await this.uploadCover();
        }
        this.showAlert('ALERTS.done_update', '');
        this.router.navigateByUrl('/admin/my-restaurant', { replaceUrl: true });
      })
      .catch(async error => {
        this.showAlert('ALERTS.error', 'ALERTS.error'); // anas
        await loading.dismiss();
      });
      // edit restaurant ----------------------

    } else {
      this.showAlert('ALERTS.required_fields', '');
    }

  }

  async uploadAvatar(): Promise<any> {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      message: this.translatePipe.transform('ALERTS.upload_avatar')
    });
    await loading.present();
    const imageURL = `images/avatar_${new Date().getTime()}.${this.avatarFormat}`;
    const imageStorageURL = imageURL.replace(`.${this.avatarFormat}`,`_500x500.${this.avatarFormat}`);
    const storageRef = ref(this.fireStorage, imageURL);
    return uploadString(storageRef, this.avatarDataSource, 'data_url')
    .then(async (snapshot) => {
      let fireImageUrl = `https://firebasestorage.googleapis.com/v0/b/qrmenu-act.appspot.com/o/${imageStorageURL.replace('/','%2F')}?alt=media`
      let cafeData = {avatar_url: fireImageUrl, avatar_path: imageStorageURL};
      // Delete the file
      try {
        const deleteRef = ref(this.fireStorage, this.cafeData.avatar_path);
        await deleteObject(deleteRef);
      } catch (error) {
        console.log('error delete avatar');
      }
      // add item ----------------------
      await this.fireAdmin.updateCafe(this.cafeData.id, cafeData);
      await loading.dismiss();
    })
    .catch(async (error) => {
      console.log('error ');
      await loading.dismiss();
    });
  }

  async uploadCover(): Promise<any> {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      message: this.translatePipe.transform('ALERTS.upload_cover') // t-anas
    });
    await loading.present();
    const imageURL = `images/cover_${new Date().getTime()}.${this.coverFormat}`;
    const imageStorageURL = imageURL.replace(`.${this.coverFormat}`,`_500x500.${this.coverFormat}`);
    const storageRef = ref(this.fireStorage, imageURL);
    return uploadString(storageRef, this.coverDataSource, 'data_url')
    .then(async (snapshot) => {
      let fireImageUrl = `https://firebasestorage.googleapis.com/v0/b/qrmenu-act.appspot.com/o/${imageStorageURL.replace('/','%2F')}?alt=media`
      let cafeData = {cover_url: fireImageUrl, cover_path: imageStorageURL};
      // Delete the file
      try {
        const deleteRef = ref(this.fireStorage, this.cafeData.cover_path);
        await deleteObject(deleteRef);
      } catch (error) {
        console.log('error delete cover');
      }
      // add item ----------------------
      await this.fireAdmin.updateCafe(this.cafeData.id, cafeData);
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(3000);
      await loading.dismiss();
    })
    .catch(async (error) => {
      console.log('error');
      await loading.dismiss();
    });
  }

  async showAlert(title, message) {

    const alert = await this.alertController.create({
      header: this.translatePipe.transform(title),
      message: this.translatePipe.transform(message),
      buttons: [this.translatePipe.transform('close')],
      mode:"ios"
    });

    await alert.present();
  }

  async selectAvatar() {
    let buttons = [
      {
        text: this.translatePipe.transform('Take_Photo'),
        icon: 'camera',
        handler: () => {
          this.addAvatar(CameraSource.Camera);
        }
      },
      {
        text: this.translatePipe.transform('Choose_Photos'),
        icon: 'image',
        handler: () => {
          this.addAvatar(CameraSource.Photos);
        }
      }
    ];

    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translatePipe.transform('Select_Source'),
      buttons
    });
    await actionSheet.present();
  }

  async addAvatar(source: CameraSource) {
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
    this.avatarDataSource = imageData;
    this.avatarFormat = image.format;
    this.avatarBase46 = image.base64String;
  }

  async selectCover() {
    let buttons = [
      {
        text: this.translatePipe.transform('Take_Photo'),
        icon: 'camera',
        handler: () => {
          this.addCover(CameraSource.Camera);
        }
      },
      {
        text: this.translatePipe.transform('Choose_Photos'),
        icon: 'image',
        handler: () => {
          this.addCover(CameraSource.Photos);
        }
      }
    ];

    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translatePipe.transform('Select_Source'),
      buttons
    });
    await actionSheet.present();
  }

  async addCover(source: CameraSource) {
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
    this.coverDataSource = imageData;
    this.coverFormat = image.format;
    this.coverBase46 = image.base64String;
  }

}
