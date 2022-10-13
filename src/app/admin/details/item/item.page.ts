import { Component, OnInit } from '@angular/core';
import { deleteObject, ref, Storage, uploadString } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ShowRefPage } from 'src/app/modals/show-ref/show-ref.page';
import { DataService } from 'src/app/services/data/data.service';
import { FireAdminService } from 'src/app/services/fire-admin.service';
import { FireServiceService } from 'src/app/services/fire-service.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {

  item: any;

  imageDataSource: any;
  imageFormat: any;
  imageBase46: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fireAdmin: FireAdminService,
    private translatePipe: TranslatePipe,
    private actionSheetCtrl: ActionSheetController,
    private fireStorage: Storage,
    private loadingController: LoadingController,
    private dataService: DataService,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if (this.route.snapshot.data['data']) {
      this.item = this.route.snapshot.data['data'].item;
      console.log(this.item);
    } else {
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
  }

  ionViewDidEnter() {
    if (this.route.snapshot.data['data']) {
      this.item = this.route.snapshot.data['data'].item;
    } else {
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
  }

  // back() {
  //   this.router.navigateByUrl('/admin/my-items', { replaceUrl: true });
  // }

  editItem() {
    this.dataService.setData(this.item.id, { item: this.item });
    this.router.navigate(['/admin/details/edit-item/' + this.item.id]);
  }

  changeActive() {
    this.item.active = !this.item.active;
    this.fireAdmin.updateActive(this.item.id, this.item.active);
  }

  changeShow() {
    this.item.show = !this.item.show;
    this.fireAdmin.updateShow(this.item.id, this.item.show);
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

    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translatePipe.transform('Select_Source'),
      buttons
    });
    await actionSheet.present();
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
    this.uploadImage();
  }

  async uploadImage() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1'
    });
    await loading.present();
    const imageURL = `images/item_${new Date().getTime()}.${this.imageFormat}`;
    const imageStorageURL = imageURL.replace(`.${this.imageFormat}`,`_500x500.${this.imageFormat}`);
    const storageRef = ref(this.fireStorage, imageURL);
    uploadString(storageRef, this.imageDataSource, 'data_url')
      .then(async (snapshot) => {
        let fireImageUrl = `https://firebasestorage.googleapis.com/v0/b/qrmenu-act.appspot.com/o/${imageStorageURL.replace('/', '%2F')}?alt=media`
        let itemData = { image_url: fireImageUrl, image_path: imageStorageURL };
        // Delete the file
        try {
          const deleteRef = ref(this.fireStorage, this.item.image_path);
          await deleteObject(deleteRef);
          console.log('image deleted');
        } catch (error) {
          console.log('error delete image: ', error);
        }
        // add item ----------------------
        await this.fireAdmin.updateItem(this.item.id, itemData);
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(2000);
        this.item.image_url = fireImageUrl;
        this.item.image_path = imageStorageURL;
        await loading.dismiss();
      })
      .catch(async (error) => {
        console.log('error');
        await loading.dismiss();
      });
  }

  async deletItem() {
    const confirm = await this.confirmationAlert();
    if (confirm) {
      console.log('Deleted');
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1'
      });
      await loading.present();
      this.fireAdmin.deleteItem(this.item.id)
      .then(async res => {
        // Delete the file
        try {
          const deleteRef = ref(this.fireStorage, this.item.image_path);
          await deleteObject(deleteRef);
          console.log('image deleted');
        } catch (error) {
          console.log('error delete image: ', error);
        }

        await loading.dismiss();
        await this.showAlert('ALERTS.done_delete_item', '', 'ok');
        this.router.navigateByUrl('/admin/my-items', { replaceUrl: true });
      })
      .catch(async error => {
        this.showAlert('ALERTS.error', 'ALERTS.error', 'close'); // anas
        await loading.dismiss();
      });
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

  private async confirmationAlert(): Promise<boolean> {
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<boolean>(resolve => {
      resolveFunction = resolve;
    });
    const alert = await this.alertController.create({
      header: this.translatePipe.transform('ALERTS.confirmation'),
      message: this.translatePipe.transform("ALERTS.confirmation_desc"),
      mode: 'ios',
      backdropDismiss: false,
      buttons: [
        {
          text: this.translatePipe.transform('ALERTS.no'),
          handler: () => resolveFunction(false)
        },
        {
          text: this.translatePipe.transform('ALERTS.yes'),
          handler: () => resolveFunction(true)
        }
      ]
    });
    await alert.present();
    return promise;
  }

  async showRef(refId) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1'
    });
    await loading.present();
    console.log(refId);
    let itemRef = await this.fireAdmin.getItem(refId);
    console.log(itemRef.data());
    const modal = await this.modalController.create({
      component: ShowRefPage,
      cssClass: 'custom-modal',
      componentProps: { item: itemRef.data() },
      presentingElement: await this.modalController.getTop(),
    });
    await loading.dismiss();
    return await modal.present();
  }
}

