import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
// import { Router } from '@angular/router';
// import { DataService } from 'src/app/services/data/data.service';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { FireServiceService } from 'src/app/services/fire-service.service';
import { PrintQrService } from 'src/app/services/print-qr.service';

@Component({
  selector: 'app-my-restaurant',
  templateUrl: './my-restaurant.page.html',
  styleUrls: ['./my-restaurant.page.scss'],
})
export class MyRestaurantPage implements OnInit {

  cafeData: any;
  sub: any;
  constructor(
    private fireservice: FireServiceService,
    private fireAuth: FireAuthService,
    private router: Router,
    private dataService: DataService,
    private printQrService: PrintQrService
  ) { }

  ngOnInit() {
    this.sub = this.fireservice.getCafeById(this.fireAuth.cafeUser.cafe_id).subscribe(res => {
      this.cafeData =  res;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  editRestaurant() {
    this.dataService.setData(this.cafeData.id, {cafeData: this.cafeData});
    this.router.navigate(['/admin/details/edit-restaurant/' + this.cafeData.id]);
  }

  openRestaurant() {
    this.dataService.setData(this.cafeData.id, {cafeData: this.cafeData});
    this.router.navigate(['/restaurant/' + this.cafeData.id]);
  }

  printQr() {
    this.printQrService.printDocument(this.cafeData);
  }

}
