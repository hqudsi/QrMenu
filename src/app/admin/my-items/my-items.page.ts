import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import algoliasearch from 'algoliasearch';
import { ImportItemPage } from 'src/app/modals/import-item/import-item.page';
import { DataService } from 'src/app/services/data/data.service';
import { FireAdminService } from 'src/app/services/fire-admin.service';
import { FireAuthService } from 'src/app/services/fire-auth.service';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.page.html',
  styleUrls: ['./my-items.page.scss'],
})
export class MyItemsPage implements OnInit {

  startSearch: boolean = false;
  fitchingData: boolean = false;
  items: any;

  myItems: any;

  myItems2 = [];
  lastVisible: any;
  showIfinite = true;

  disableRefresher = false;

  myCategories: any;
  sub: any;

  currenctCategory = null;
  constructor(
    private fireAdmin: FireAdminService,
    private router: Router,
    private dataService: DataService,
    private fireAuth: FireAuthService,
    private popoverController: PopoverController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.loadCategory();
  }

  ionViewDidEnter() {
    this.loadItems();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  loadCategory() {
    this.sub = this.fireAdmin.getMyCategories().subscribe(res => {
      this.myCategories = res;
    });
  }

  changeCategory(event) {
    this.currenctCategory = event.detail.value;
    this.loadItems();
  }

  toggleReorder() {
    this.router.navigate(['/admin/reorder-items']);
    this.popoverController.dismiss();
  }

  dismissPopover() {
    this.popoverController.dismiss();
  }

  async importItem() {
    const modal = await this.modalController.create({
      component: ImportItemPage,
      cssClass: 'custom-modal-80',
      backdropDismiss: false
    });
    this.popoverController.dismiss();
    await modal.present();
    let res = await modal.onDidDismiss();
    if (res.data) {
      this.myCategories = null;
      this.loadItems();
    }
  }

  async loadItems(refresher?) {
    if (!this.startSearch) {
      const documentSnapshots =
        this.currenctCategory ?
          await this.fireAdmin.getMyItemsOfCatPagination(10, this.currenctCategory) :
          await this.fireAdmin.getMyItemsPagination(10);
      this.myItems2 = [];
      documentSnapshots.forEach((doc) => {
        this.myItems2.push({ ...doc.data(), ... { id: doc.id } });
      });
      if (refresher) {
        refresher.target.complete();
      }
      this.lastVisible = documentSnapshots.docs[documentSnapshots.size - 1];
      this.showIfinite = true;
    } else {
      if (refresher) {
        refresher.target.complete();
      }
    }
  }

  async loadMoreData(event) {
    const documentSnapshots =
      this.currenctCategory ?
        await this.fireAdmin.getNextMyItemsOfCatPagination(10, this.lastVisible, this.currenctCategory) :
        await this.fireAdmin.getNextMyItemsPagination(10, this.lastVisible);
    if (documentSnapshots.size < 10) {
      documentSnapshots.forEach((doc) => {
        this.myItems2.push({ ...doc.data(), ... { id: doc.id } });
      });
      event.target.complete();
      this.showIfinite = false;
      return;
    }
    documentSnapshots.forEach((doc) => {
      this.myItems2.push({ ...doc.data(), ... { id: doc.id } });
    });
    event.target.complete();
    this.lastVisible = documentSnapshots.docs[documentSnapshots.size - 1];

  }

  showItem(item) {
    this.dataService.setData(item.id, { item: item });
    this.router.navigateByUrl('/admin/details/item/' + item.id, { replaceUrl: true });
  }

  changeActive(item) {
    item.active = !item.active;
    this.fireAdmin.updateActive(item.id, item.active);
  }

  changeShow(item) {
    item.show = !item.show;
    this.fireAdmin.updateShow(item.id, item.show);
  }

  async search(event) {
    if (event.target.value) {
      this.currenctCategory = null;
      this.startSearch = true;
      this.fitchingData = true;
      this.showIfinite = false;
      this.disableRefresher = true;
      const query = event.target.value.toLowerCase();
      const client = algoliasearch('VH67RASCNV', '6dad6e128825cacc30b1092cc00e1e6a');
      const index = client.initIndex('items');
      let results = (await index.search(query, { filters: `cafe_id:${this.fireAuth.cafeUser.cafe_id}` })).hits;
      this.items = results;
      this.items.forEach(element => {
        element.id = element.objectID;
      });
      this.fitchingData = false;
    }
  }

  async inputSearh(event) {
    if (!event.target.value) {
      this.startSearch = false;
      this.showIfinite = true;
      this.disableRefresher = false;
      this.loadItems();
    }
  }

}
