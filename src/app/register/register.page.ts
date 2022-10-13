import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { FireServiceService } from '../services/fire-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  credentials: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private fireService: FireServiceService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private translatePipe: TranslatePipe
  ) { }

  ngOnInit() {
    this.credentials = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      cafe_name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      status: ['new'],
      created_at: [null],
    });
  }

  async register() {
    if (this.credentials.valid) {
      this.credentials.patchValue({ created_at: new Date() });
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1'
      });
      await loading.present();
      await this.fireService.register(this.credentials.value)
      .then(async result => {
        this.showAlert('ALERTS.success_register', '', 'ok');
        this.router.navigateByUrl('/', { replaceUrl: true });
        await loading.dismiss();
      })
      .catch(async error => {
        this.showAlert('ALERTS.error', 'ALERTS.error', 'close');
        await loading.dismiss();
      });
    } else {
      this.showAlert('ALERTS.required_fields', '', 'close');
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
