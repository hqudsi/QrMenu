import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FireAdminService } from 'src/app/services/fire-admin.service';

@Component({
  selector: 'app-reorder-category-items',
  templateUrl: './reorder-category-items.page.html',
  styleUrls: ['./reorder-category-items.page.scss'],
})
export class ReorderCategoryItemsPage implements OnInit {
  categoryId: any;
  items: Array<any>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fireAdmin: FireAdminService
  ) {
    if (this.route.snapshot.params['id']) {
      this.categoryId = this.route.snapshot.params['id'];
    } else {
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const documentSnapshots = await this.fireAdmin.getMyItemsOfCatPromise(this.categoryId);
    this.items = []
    documentSnapshots.forEach((doc) => {
      this.items.push({ ...doc.data(), ... { id: doc.id } });
    });
    console.log(this.items);
  }

  doReorder(ev) {
    this.items = ev.detail.complete(this.items);
    this.items.map(function (currentValue, Index) {
      currentValue.order = Index + 1;
    });
    console.log(this.items);
  }

  save() {
    this.items.forEach(item => {
      this.fireAdmin.updateItem(item.id, item);
    });
    this.router.navigateByUrl('/admin/reorder-items', { replaceUrl: true });
  }
}
