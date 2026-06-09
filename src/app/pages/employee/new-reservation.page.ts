import { Component, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonButtons, IonBackButton,
  IonItem, IonInput, IonLabel, IonGrid, IonRow, IonCol,
  LoadingController, AlertController, NavController,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../shared/reservation.service';
import { addIcons } from 'ionicons';
import { checkmark } from 'ionicons/icons';

@Component({
  selector: 'app-new-reservation',
  templateUrl: 'new-reservation.page.html',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonButtons, IonBackButton,
    IonItem, IonInput, IonLabel, IonGrid, IonRow, IonCol,
    FormsModule,
  ],
})
export class NewReservationPage {
  date: string = '';
  time: string = '';
  numberOfGuests: number = 1;

  reservationService = inject(ReservationService);
  loadingCtrl = inject(LoadingController);
  alertCtrl = inject(AlertController);
  navCtrl = inject(NavController);

  constructor() {
    addIcons({ checkmark });
  }

  async onSubmit() {
    const loading = await this.loadingCtrl.create({ message: 'Slanje...' });
    await loading.present();

    this.reservationService
      .addReservation(this.date, this.time, this.numberOfGuests)
      .subscribe({
        next: async () => {
          await loading.dismiss();
          const alert = await this.alertCtrl.create({
            header: 'Uspješno!',
            message: 'Rezervacija je poslata.',
            buttons: ['OK'],
          });
          await alert.present();
          this.navCtrl.navigateBack('/home');
        },
        error: async () => {
          await loading.dismiss();
          const alert = await this.alertCtrl.create({
            header: 'Greška',
            message: 'Pokušajte ponovo.',
            buttons: ['OK'],
          });
          await alert.present();
        },
      });
  }
}