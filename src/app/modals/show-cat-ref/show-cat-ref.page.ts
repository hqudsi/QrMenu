import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-show-cat-ref',
  templateUrl: './show-cat-ref.page.html',
  styleUrls: ['./show-cat-ref.page.scss'],
})
export class ShowCatRefPage implements OnInit {

  category: any;
  constructor(
    private navParams: NavParams,
    private modalController: ModalController
  ) {
    this.category = this.navParams.data.category;
    console.log(this.category);
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
