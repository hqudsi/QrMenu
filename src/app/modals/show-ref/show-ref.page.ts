import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-show-ref',
  templateUrl: './show-ref.page.html',
  styleUrls: ['./show-ref.page.scss'],
})
export class ShowRefPage implements OnInit {

  item: any;
  constructor(
    private navParams: NavParams,
    private modalController: ModalController
  ) {
    this.item = this.navParams.data.item;
    console.log(this.item);
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
