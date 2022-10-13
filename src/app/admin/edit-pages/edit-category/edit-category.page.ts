import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { FireAdminService } from 'src/app/services/fire-admin.service';
import { FireAuthService } from 'src/app/services/fire-auth.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.page.html',
  styleUrls: ['./edit-category.page.scss'],
})
export class EditCategoryPage implements OnInit {

  credentials: FormGroup;
  categories: any;

  category: any;
  types: any;
  userType: number = 2;
  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private translatePipe: TranslatePipe,
    private fireAdmin: FireAdminService,
    private route: ActivatedRoute,
    private router: Router,
    private fireAuthService: FireAuthService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.data['data']) {
      this.category = this.route.snapshot.data['data'].category;
    } else {
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
    this.userType = this.fireAuthService.cafeUser.type;
    this.credentials = this.formBuilder.group({
      name: ['', [Validators.required]],
      notes: [null],
      type_id: ['', [Validators.required]],
      update_at: [new Date(),[]],
      defualt_category: [false],
      selected_category: [false]
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
    this.credentials.patchValue({ name: this.category.name });
    this.credentials.patchValue({ type_id: this.category.type_id });
    this.credentials.patchValue({ notes: this.category.notes? this.category.notes: null });
    this.credentials.patchValue({ defualt_category: this.category.defualt_category? this.category.defualt_category: null });
    this.credentials.patchValue({ selected_category: this.category.selected_category? this.category.selected_category: null });
  }

  async editCategory() {
    this.credentials.patchValue({ update_at: new Date() });
    console.log(this.credentials.value);
    if (this.credentials.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1'
      });
      await loading.present();
      // add category ----------------------
      await this.fireAdmin.updateCategory(this.category.id, this.credentials.value)
      .then(async result => {
        await loading.dismiss();
        await this.showAlert('ALERTS.category_done_update', '', 'ok');
        this.router.navigateByUrl('/admin/my-categories', { replaceUrl: true });
      })
      .catch(async error => {
        console.log(error);
        this.showAlert('ALERTS.error', 'ALERTS.error', 'close'); // anas
        await loading.dismiss();
      });
      // add category ----------------------

    } else {
      this.showAlert('ALERTS.required_fields', '', 'close');
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
