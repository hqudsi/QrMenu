import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { FireAuthService } from '../services/fire-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  credentials: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private fireAuth: FireAuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private translatePipe: TranslatePipe
  ) { }

  ngOnInit() {
    this.credentials = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async login() {
    this.credentials.patchValue({ email: this.credentials.get("email").value.trim() });
    if (this.credentials.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1'
      });
      await loading.present();
      await this.fireAuth.signIn(this.credentials.value)
      .then(async result => {
        await loading.dismiss();
        if (result) {
          if (this.fireAuth.cafeUser.type === 2 || this.fireAuth.cafeUser.type === 4) {
            this.router.navigateByUrl('/admin', { replaceUrl: true });
          } else {
            this.router.navigateByUrl('/super-admin', { replaceUrl: true });
          }
        } else {
          this.showAlert('ALERTS.error', 'ALERTS.login_failed', 'close'); // anas
        }
      })
      .catch(async error => {
        this.showAlert('ALERTS.login_failed', 'ALERTS.invalid_username_password', 'close'); // anas
        await loading.dismiss();
      });
    } else {
      this.showAlert('ALERTS.error', 'ALERTS.check_users_data', 'close'); // anas
    }
  }

  async showAlert(title, message, button) {

    const alert = await this.alertController.create({
      header: this.translatePipe.transform(title),
      message: this.translatePipe.transform(message),
      buttons: [this.translatePipe.transform(button)],
      mode:"ios"
    });

    await alert.present();
    await alert.onDidDismiss();
  }
}
