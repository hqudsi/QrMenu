import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { ImportCategoryPage } from 'src/app/modals/import-category/import-category.page';
import { DataService } from 'src/app/services/data/data.service';
import { FireAdminService } from 'src/app/services/fire-admin.service';

@Component({
  selector: 'app-my-categories',
  templateUrl: './my-categories.page.html',
  styleUrls: ['./my-categories.page.scss'],
})
export class MyCategoriesPage implements OnInit {

  myCategories: Array<any>;
  sub: any;
  disabledReorderGroup: boolean = true;
  myCategoriesGrouped: any;
  myCategoriesKyes: any;

  constructor(
    private fireAdmin: FireAdminService,
    private router: Router,
    private dataService: DataService,
    private popoverController: PopoverController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.loadData();
  }

  // ngOnDestroy() {
  //   this.sub.unsubscribe();
  // }

  async loadData() {
    const documentSnapshots = await this.fireAdmin.getMyCategoriesPromise();
    this.myCategories = []
    documentSnapshots.forEach((doc) => {
      this.myCategories.push({ ...doc.data(), ... { id: doc.id } });
    });
    console.log(this.myCategories);
    this.myCategoriesGrouped = this.groupBy(this.myCategories, 'type_id');
    this.myCategoriesKyes = Object.keys(this.myCategoriesGrouped);
  }

  groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  showCategory(category) {
    this.dataService.setData(category.id, { category: category });
    this.router.navigate(['/admin/details/category/' + category.id]);
  }

  doReorder(ev, group) {
    this.myCategoriesGrouped[group] = ev.detail.complete(this.myCategoriesGrouped[group]);
    this.myCategoriesGrouped[group].map(function (currentValue, Index) {
      currentValue.order = Index + 1;
    });
  }

  toggleReorderGroup() {
    this.disabledReorderGroup = !this.disabledReorderGroup;
    this.popoverController.dismiss();
  }

  dismissPopover() {
    this.popoverController.dismiss();
  }

  save() {
    this.disabledReorderGroup = true;
    this.myCategories.forEach(category => {
        this.fireAdmin.updateCategory(category.id, category);
    });
  }

  async importCategory() {
    const modal = await this.modalController.create({
      component: ImportCategoryPage,
      cssClass: 'custom-modal-80',
      backdropDismiss: false
    });
    this.popoverController.dismiss();
    await modal.present();
    let res = await modal.onDidDismiss();
    if (res.data) {
      this.myCategories = null;
      this.loadData();
    }
  }

}
