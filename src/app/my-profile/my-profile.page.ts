import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChangePasswordModalPage } from 'src/app/modals/change-password-modal/change-password-modal.page';
import { FireAuthService } from 'src/app/services/fire-auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  userData: any;

  constructor(
    private fireAuth: FireAuthService,
    private modalController: ModalController
  ) {
    this.userData = this.fireAuth.userData;
  }

  ngOnInit() {
  }

  async changePassword() {
    const modal = await this.modalController.create({
      component: ChangePasswordModalPage,
      cssClass: 'custom-modal',
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });
    return await modal.present();
  }

}
