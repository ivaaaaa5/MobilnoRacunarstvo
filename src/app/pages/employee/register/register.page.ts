import { Component, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonInput, IonItem, IonLabel,
  IonSelect, IonSelectOption,
  IonGrid, IonRow, IonCol,
  LoadingController, AlertController,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonInput, IonItem, IonLabel,
    IonSelect, IonSelectOption,
    IonGrid, IonRow, IonCol,
    FormsModule, RouterLink,
  ],
})
export class RegisterPage {
  email = '';
  password = '';
  name = '';
  role = 'klijent';

  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private alertCtrl = inject(AlertController);
  private authService = inject(AuthService);

  async onRegister() {
    const loading = await this.loadingCtrl.create({ message: 'Registracija...' });
    await loading.present();

    try {
      await this.authService.register(this.email, this.password, this.name, this.role);

      await loading.dismiss();
      this.router.navigateByUrl('/login');
    } catch (e: any) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Greška',
        message: e.message,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}