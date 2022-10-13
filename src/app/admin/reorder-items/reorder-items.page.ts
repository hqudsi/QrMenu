import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FireAdminService } from 'src/app/services/fire-admin.service';

@Component({
  selector: 'app-reorder-items',
  templateUrl: './reorder-items.page.html',
  styleUrls: ['./reorder-items.page.scss'],
})
export class ReorderItemsPage implements OnInit {

  myCategories: Array<any>;
  myCategoriesGrouped: any;
  myCategoriesKyes: any;
  constructor(
    private fireAdmin: FireAdminService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

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
    this.router.navigate(['/admin/reorder-category-items/' + category.id]);
  }
}
