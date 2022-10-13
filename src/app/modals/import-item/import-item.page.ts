import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { FireAdminService } from 'src/app/services/fire-admin.service';
import { FireAuthService } from 'src/app/services/fire-auth.service';

@Component({
  selector: 'app-import-item',
  templateUrl: './import-item.page.html',
  styleUrls: ['./import-item.page.scss'],
})
export class ImportItemPage implements OnInit {

  categories: Array<any>;
  categoriesGrouped: any;
  categoriesKeys: Array<any> = [];

  items: Array<any>;
  itemsGrouped: any;
  itemsKeys: any;

  selectedItems: Array<any> = [];
  selectedItemsKeys: Array<any> = [];

  refCategories: Array<any>;

  section: number = 1;

  constructor(
    private modalController: ModalController,
    private fireAdmin: FireAdminService,
    private fireAuth: FireAuthService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.loadData();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  back() {
    this.section = this.section - 1;
  }

  next() {
    this.section = this.section + 1;
  }

  checkItemsGroup(itemEntry) {
    if (!itemEntry.isChecked && !itemEntry.someChecked) {
      this.items.filter(item => item.category_name === itemEntry.name).forEach(item => {
        item.isChecked = true;
        if (!this.selectedItems.map(function(e) { return e.name; }).includes(item.name)) {
          this.selectedItems.push(item);
        }
      });
      itemEntry.isChecked = true;
    } else {
      this.items.filter(item => item.category_name === itemEntry.name).forEach(item => {
        item.isChecked = false;
        const index = this.selectedItems.map(function(e) { return e.name; }).indexOf(item.name, 0);
        if (index > -1) {
          this.selectedItems.splice(index, 1);
        }
      });
      itemEntry.isChecked = false;
      itemEntry.someChecked = false;
    }
  }

  checkGroup(entry) {
    if (!entry.isChecked && !entry.someChecked) {
      this.categories.filter(cat => cat.type_id === entry.name).forEach(cat => {
        cat.isChecked = true;
        if (!this.selectedItemsKeys.map(function(e) { return e.name; }).includes(cat.name)) {
          this.selectedItemsKeys.push({
            name: cat.name,
            isChecked: false,
            someChecked: false
          });
        }
      });
      entry.isChecked = true;
    } else {
      this.categories.filter(cat => cat.type_id === entry.name).forEach(cat => {
        cat.isChecked = false;
        const index = this.selectedItemsKeys.map(function(e) { return e.name; }).indexOf(cat.name, 0);
        if (index > -1) {
          this.selectedItemsKeys.splice(index, 1);
        }
      });
      entry.isChecked = false;
      entry.someChecked = false;
    }

  }

  checkedCategory(category, entry) {
    if (category.isChecked) {
      if (!this.selectedItemsKeys.map(function(e) { return e.name; }).includes(category.name)) {
        this.selectedItemsKeys.push({
          name: category.name,
          isChecked: false,
          someChecked: false
        });
      }
    } else {
      const index = this.selectedItemsKeys.map(function(e) { return e.name; }).indexOf(category.name, 0);
      if (index > -1) {
        this.selectedItemsKeys.splice(index, 1);
      }
    }
    entry.someChecked = this.categories.filter(cat => cat.type_id === entry.name).some(cat => cat.isChecked === true);
    entry.isChecked = this.categories.filter(cat => cat.type_id === entry.name).every(cat => cat.isChecked === true);
  }

  checkedItem(item, itemEntry) {
    if (item.isChecked) {
      if (!this.selectedItems.map(function(e) { return e.name; }).includes(item.name)) {
        this.selectedItems.push(item);
      }
    } else {
      const index = this.selectedItems.map(function(e) { return e.name; }).indexOf(item.name, 0);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      }
    }
    itemEntry.someChecked = this.items.filter(item => item.category_name === itemEntry.name).some(item => item.isChecked === true);
    itemEntry.isChecked = this.items.filter(item => item.category_name === itemEntry.name).every(item => item.isChecked === true);
  }

  async loadData() {
    // load Categories
    const documentSnapshots = await this.fireAdmin.getAllSelectedCategories();
    this.categories = []
    documentSnapshots.forEach((doc) => {
      this.categories.push({ ...doc.data(), ... { id: doc.id } });
    });
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
    // load Refereance Item
    const refItemsSnapshots = await this.fireAdmin.getReferenceItems();
    let refItems = [];
    refItemsSnapshots.forEach((doc) => {
      // this.refCategories.push(doc.data().ref_category);
      // refItems.push({ ...doc.data(), ... { id: doc.id } });
      refItems.push(doc.data().ref_item);
    });
    // load Items
    const itemsDocumentSnapshots = await this.fireAdmin.getAllSelectedItems();
    this.items = [];
    itemsDocumentSnapshots.forEach((doc) => {
      if (!refItems.some(itemId=> itemId === doc.id)) {
        this.items.push({ ...doc.data(), ... { id: doc.id } });
      }
    });
    this.items.forEach(item => {
      item.price = null;
      item.category_id = item.categories[0];
      item.category_name = this.categories.find(cate => cate.id == item.category_id).name;
    });
    this.itemsGrouped = this.groupBy(this.items, 'category_name');3
    this.itemsKeys = Object.keys(this.itemsGrouped);
    // load Refereance Category
    const refDocumentSnapshots = await this.fireAdmin.getReferenceCategories();
    this.refCategories = [];
    refDocumentSnapshots.forEach((doc) => {
      // this.refCategories.push(doc.data().ref_category);
      this.refCategories.push({ ...doc.data(), ... { id: doc.id } });
    });
  }


  groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  gotoNextField() {
    var nextEl = this.findNextTabStop(document.activeElement);
    nextEl.focus();
    nextEl.select();
  }

  findNextTabStop(el) {
    var universe = document.querySelectorAll(
      "ion-input, input, button, ion-button"
    );
    var list = Array.prototype.filter.call(universe, function(item) {
      return item.tabIndex >= "0";
    });
    var index = list.indexOf(el);
    return list[index + 1] || list[0];
  }

  async save() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1'
    });
    await loading.present();

    let newCategories = JSON.parse(JSON.stringify(this.categories.filter(cat => cat.isChecked === true)));
    await newCategories.forEach(async category => {
      let refCategory = this.refCategories.find(cat => cat.ref_category === category.id);
      if (!refCategory) {
        //new
        let newItems = this.selectedItems.filter(item => item.category_id === category.id);
        category.cafe_id = this.fireAuth.cafeUser.cafe_id;
        category.create_at = new Date();
        category.ref_category = category.id;
        category.image_path = null;
        category.order = 99;
        await delete category.id;
        await delete category.isChecked;
        await delete category.update_at;

        let newCategory = await this.fireAdmin.addCategory(category);
        await newItems.forEach(async item => {
          item.cafe_id = this.fireAuth.cafeUser.cafe_id;
          item.create_at = new Date();
          item.ref_item = item.id;
          item.image_path = null;
          item.order = 99;
          item.categories = [newCategory.id];
          item.multi_category = false;
          delete item.id;
          delete item.isChecked;
          delete item.update_at;
          await this.fireAdmin.addItem(item);
        });

        // this.fireAdmin.addCategory(category).then(async res => {
        //     await newItems.forEach(async item => {
        //       item.cafe_id = this.fireAuth.cafeUser.cafe_id;
        //       item.create_at = new Date();
        //       item.ref_item = item.id;
        //       item.image_path = null;
        //       item.order = 99;
        //       item.categories = [res.id];
        //       item.multi_category = false;
        //       delete item.id;
        //       delete item.isChecked;
        //       delete item.update_at;
        //       await this.fireAdmin.addItem(item);
        //     });
        // });


        // let newCategory = await this.fireAdmin.addCategory(category);
        // let newItems = this.selectedItems.filter(item => item.category_id === category.id);
        // await newItems.forEach(async item => {
        //   item.cafe_id = this.fireAuth.cafeUser.cafe_id;
        //   item.create_at = new Date();
        //   item.ref_item = item.id;
        //   item.image_path = null;
        //   item.order = 99;
        //   item.categories = [newCategory.id];
        //   item.multi_category = false;
        //   delete item.id;
        //   delete item.isChecked;
        //   delete item.update_at;
        //   await this.fireAdmin.addItem(item);
        // });
      } else {
        //old
        let newItems = this.selectedItems.filter(item => item.category_id === category.id);
        await newItems.forEach(async item => {
          item.cafe_id = this.fireAuth.cafeUser.cafe_id;
          item.create_at = new Date();
          item.ref_item = item.id;
          item.image_path = null;
          item.order = 99;
          item.categories = [refCategory.id];
          item.multi_category = false;
          delete item.id;
          delete item.isChecked;
          delete item.update_at;
          await this.fireAdmin.addItem(item);
        });
      }

      // category.cafe_id = this.fireAuth.cafeUser.cafe_id;
      // category.create_at = new Date();
      // category.ref_item = category.id;
      // category.image_path = null;
      // category.order = 99;
      // delete category.id;
      // delete category.isChecked;
      // delete category.update_at;
      // this.fireAdmin.addCategory(category);
    });
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(3000);
    await loading.dismiss();
    this.modalController.dismiss(true);

    // let items = JSON.parse(JSON.stringify(this.selectedItems));
    // items.forEach(item => {
    //   item.cafe_id = this.fireAuth.cafeUser.cafe_id;
    //   item.create_at = new Date();
    //   item.ref_item = item.id;
    //   item.image_path = null;
    //   item.order = 99;
    //   delete item.id;
    //   delete item.isChecked;
    //   delete item.update_at;
    //   this.fireAdmin.addItem(item);
    // });
    // this.modalController.dismiss(items);
  }
}
