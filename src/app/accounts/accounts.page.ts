import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { FireAdminService } from '../services/fire-admin.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
})
export class AccountsPage implements OnInit {
  users: any;
  sub: any;
  constructor(
    private fireAdmin: FireAdminService
  ) { }

  ngOnInit() {
    this.loadRequest();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async loadRequest() {
    this.sub = this.fireAdmin.getUsersAccounts().subscribe(res => {
      this.users = res;
      console.log(this.users);
    });
  }
}
