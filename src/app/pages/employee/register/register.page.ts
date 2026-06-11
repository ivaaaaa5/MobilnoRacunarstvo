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
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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

  private auth = inject(Auth);
  private http = inject(HttpClient);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private alertCtrl = inject(AlertController);

  async onRegister() {
    const loading = await this.loadingCtrl.create({ message: 'Registracija...' });
    await loading.present();

    try {
      const result = await createUserWithEmailAndPassword(
        this.auth, this.email, this.password
      );

      await this.http.put(
        `${environment.firebaseConfig.databaseURL}/users/${result.user.uid}.json`,
        { email: this.email, name: this.name, role: this.role }
      ).toPromise();

      await loading.dismiss();
      this.router.navigateByUrl('/home');
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