import { Component, OnInit } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { CameraSource, Camera, CameraResultType } from '@capacitor/camera';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ref, uploadString, deleteObject } from 'firebase/storage';
import { ShowCatRefPage } from 'src/app/modals/show-cat-ref/show-cat-ref.page';
import { DataService } from 'src/app/services/data/data.service';
import { FireAdminService } from 'src/app/services/fire-admin.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  category: any;

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
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if (this.route.snapshot.data['data']) {
      this.category = this.route.snapshot.data['data'].category;
    } else {
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
  }

  editCategory() {
    this.dataService.setData(this.category.id, {category: this.category});
    this.router.navigate(['/admin/details/edit-category/' + this.category.id]);
  }

  changeActive() {
    this.category.active = !this.category.active;
    this.fireAdmin.updateActive(this.category.id, this.category.active);
  }

  changeShow() {
    this.category.show = !this.category.show;
    this.fireAdmin.updateShow(this.category.id, this.category.show);
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
    const imageURL = `images/category_${new Date().getTime()}.${this.imageFormat}`;
    const imageStorageURL = imageURL.replace(`.${this.imageFormat}`,`_500x500.${this.imageFormat}`);
    const storageRef = ref(this.fireStorage, imageURL);
    uploadString(storageRef, this.imageDataSource, 'data_url')
    .then(async (snapshot) => {
      let fireImageUrl = `https://firebasestorage.googleapis.com/v0/b/qrmenu-act.appspot.com/o/${imageStorageURL.replace('/','%2F')}?alt=media`
      let categoryData = {image_url: fireImageUrl, image_path: imageStorageURL};
      // Delete the file
      try {
        const deleteRef = ref(this.fireStorage, this.category.image_path);
        await deleteObject(deleteRef);
      } catch (error) {
        console.log('error delete image');
      }
      // add category ----------------------
      await this.fireAdmin.updateCategory(this.category.id, categoryData);
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(2000);
      this.category.image_url = fireImageUrl;
      this.category.image_path = imageStorageURL;
      await loading.dismiss();
    })
    .catch(async (error) => {
      console.log('error');
      await loading.dismiss();
    });
  }

  async showRef(refId) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1'
    });
    await loading.present();
    console.log(refId);
    let categoryRef = await this.fireAdmin.getCategory(refId);
    console.log(categoryRef.data());
    const modal = await this.modalController.create({
      component: ShowCatRefPage,
      cssClass: 'custom-modal',
      componentProps: { category: categoryRef.data() },
      presentingElement: await this.modalController.getTop(),
    });
    await loading.dismiss();
    return await modal.present();
  }


}
