import { Component, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonButtons, IonBackButton,
  IonItem, IonInput, IonLabel, IonGrid, IonRow, IonCol,
  LoadingController, AlertController, NavController,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../shared/reservation.service';
import { Reservation } from '../../shared/reservation.model';
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
    FormsModule, CommonModule,
  ],
})
export class NewReservationPage {
  date: string = '';
  time: string = '';
  numberOfGuests: number = 1;

  allSlots = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  bookedTimes: string[] = [];

  reservationService = inject(ReservationService);
  loadingCtrl = inject(LoadingController);
  alertCtrl = inject(AlertController);
  navCtrl = inject(NavController);

  constructor() {
    addIcons({ checkmark });
  }
ngOnInit() {
this.reservationService.getReservations().subscribe()
}
   onDateChange() {
    if (!this.date) return;
    this.time = '';
    this.reservationService.reservations.subscribe((reservations: any) => {
  this.bookedTimes = reservations
    .filter((r: any) => r.date === this.date && r.status !== 'cancelled')
    .map((r: any) => r.time);
});
  }

  isBooked(slot: string): boolean {
    return this.bookedTimes.includes(slot);
  }

  selectTime(slot: string) {
    if (!this.isBooked(slot)) {
      this.time = slot;
    }
  }

  getSlotColor(slot: string): string {
    if (this.isBooked(slot)) return 'danger';
    if (this.time === slot) return 'primary';
    return 'success';
  }

  async onSubmit() {
    if (!this.date || !this.time) return;
    const loading = await this.loadingCtrl.create({ message: 'Slanje...' });
    await loading.present();

  this.reservationService.addReservation(
      this.date, this.time, this.numberOfGuests
    ).subscribe({
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
