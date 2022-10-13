import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { FireAuthService } from 'src/app/services/fire-auth.service';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.page.html',
  styleUrls: ['./change-password-modal.page.scss'],
})
export class ChangePasswordModalPage implements OnInit {

  credentials: FormGroup;
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private translatePipe: TranslatePipe,
    private fireAuth: FireAuthService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.credentials = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validators: this.checkPasswords });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value
    return pass === confirmPass ? null : { notSame: true }
  }

  async save() {
    if (this.credentials.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1'
      });
      await loading.present();
      this.fireAuth.changePassword(this.credentials.get('oldPassword').value, this.credentials.get('password').value)
      .then(async () => {
        await loading.dismiss();
        await this.showAlert('ALERTS.password_changed_Successfully', '', 'close');
        this.modalController.dismiss();
      })
      .catch(error =>{
        loading.dismiss();
        if (error.message == 'auth/wrong-password') {
          this.showAlert('ALERTS.wrong_old_password', '', 'close');
        } else {
          this.showAlert('ALERTS.error_change_password', '', 'close');
        }
      });
    } else {
      if (this.credentials.hasError('notSame')) {
        this.showAlert('ALERTS.password_not_match', '', 'close');
      } else {
        this.showAlert('ALERTS.required_fields', '', 'close');
      }
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
