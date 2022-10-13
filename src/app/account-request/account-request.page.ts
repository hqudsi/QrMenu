import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { FireAdminService } from '../services/fire-admin.service';

@Component({
  selector: 'app-account-request',
  templateUrl: './account-request.page.html',
  styleUrls: ['./account-request.page.scss'],
})
export class AccountRequestPage implements OnInit {

  requests: any;
  sub: any;
  constructor(
    private fireAdmin: FireAdminService,
    private alertController: AlertController,
    private translatePipe: TranslatePipe
  ) { }

  ngOnInit() {
    this.loadRequest();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async loadRequest() {
    this.sub = this.fireAdmin.getAccountRequest().subscribe(res => {
      this.requests = res;
      console.log(this.requests);
    });
  }

  async reject(requestId) {
    const confirm = await this.confirmationAlert();
    if (confirm) {
      this.fireAdmin.rejectRequest(requestId);
    }
  }

  async accept(requestId) {
    this.fireAdmin.acceptRequest(requestId);
  }

  private async confirmationAlert(): Promise<boolean> {
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<boolean>(resolve => {
      resolveFunction = resolve;
    });
    const alert = await this.alertController.create({
      header: this.translatePipe.transform('ALERTS.reject_request'),
      message: this.translatePipe.transform("ALERTS.reject_request_desc"),
      mode: 'ios',
      backdropDismiss: false,
      buttons: [
        {
          text: this.translatePipe.transform('ALERTS.no'),
          handler: () => resolveFunction(false)
        },
        {
          text: this.translatePipe.transform('ALERTS.yes'),
          handler: () => resolveFunction(true)
        }
      ]
    });
    await alert.present();
    return promise;
  }

}
