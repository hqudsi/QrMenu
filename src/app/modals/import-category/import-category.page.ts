import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FireAdminService } from 'src/app/services/fire-admin.service';
import { FireAuthService } from 'src/app/services/fire-auth.service';

@Component({
  selector: 'app-import-category',
  templateUrl: './import-category.page.html',
  styleUrls: ['./import-category.page.scss'],
})
export class ImportCategoryPage implements OnInit {

  categories: Array<any>;
  categoriesGrouped: any;
  categoriesKeys: Array<any> = [];
  anyCheck: boolean = false;

  constructor(
    private modalController: ModalController,
    private fireAdmin: FireAdminService,
    private fireAuth: FireAuthService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async loadData() {
    const refDocumentSnapshots = await this.fireAdmin.getReferenceCategories();
    let refCategories = [];
    refDocumentSnapshots.forEach((doc) => {
      refCategories.push(doc.data().ref_category);
    });
    // console.log(refCategories);
    const documentSnapshots = await this.fireAdmin.getAllSelectedCategories();
    this.categories = [];
    documentSnapshots.forEach((doc) => {
      if (!refCategories.some(categoryId=> categoryId === doc.id)) {
        this.categories.push({ ...doc.data(), ... { id: doc.id } });
      }
    });
    // console.log(this.categories);
    this.categoriesGrouped = this.groupBy(this.categories, 'type_id');
    let tempCategoriesKeys: Array<string>;
    tempCategoriesKeys = Object.keys(this.categoriesGrouped);
    tempCategoriesKeys.forEach(element => {
      this.categoriesKeys.push({
        name: element,
        isChecked: false,
        someChecked: false
      });
    });
  }

  checkGroup(entry) {
    if (!entry.isChecked && !entry.someChecked) {
      this.categories.filter(cat => cat.type_id === entry.name).forEach(cat => {
        cat.isChecked = true;
      });
      entry.isChecked = true;
    } else {
      this.categories.filter(cat => cat.type_id === entry.name).forEach(cat => {
        cat.isChecked = false;
      });
      entry.isChecked = false;
      entry.someChecked = false;
    }
    this.anyCheck = this.categories.some(cat => cat.isChecked === true);
  }

  checkedCategory(entry) {
    entry.someChecked = this.categories.filter(cat => cat.type_id === entry.name).some(cat => cat.isChecked === true);
    entry.isChecked = this.categories.filter(cat => cat.type_id === entry.name).every(cat => cat.isChecked === true);
    this.anyCheck = this.categories.some(cat => cat.isChecked === true);
  }

  groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  save() {
    let items = JSON.parse(JSON.stringify(this.categories.filter(item => item.isChecked === true)));
    items.forEach(item => {
      item.cafe_id = this.fireAuth.cafeUser.cafe_id;
      item.create_at = new Date();
      item.ref_category = item.id;
      item.image_path = null;
      item.order = 99;
      delete item.id;
      delete item.isChecked;
      delete item.update_at;
      this.fireAdmin.addCategory(item);
    });
    this.modalController.dismiss(items);
  }

}
