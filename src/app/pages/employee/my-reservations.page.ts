import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonButtons, IonMenuButton, IonBadge,
  AlertController, LoadingController,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../shared/reservation.service';
import { Reservation } from '../../shared/reservation.model';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { trash, calendar } from 'ionicons/icons';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-my-reservations',
  templateUrl: 'my-reservations.page.html',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonButtons, IonMenuButton, IonBadge,
    CommonModule,
  ],
})
export class MyReservationsPage implements OnInit, OnDestroy {
  reservations: Reservation[] = [];
  private sub = new Subscription();

  reservationService = inject(ReservationService);
  alertCtrl = inject(AlertController);
  loadingCtrl = inject(LoadingController);
  auth = inject(Auth);

  constructor() {
    addIcons({ trash, calendar });
  }

  ngOnInit() {
    this.sub = this.reservationService.reservations.subscribe(res => {
      this.reservations = res.filter(r =>
        r.userId === this.auth.currentUser?.uid
      );
    });
    this.reservationService.getReservations().subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  canCancel(reservation: Reservation): boolean {
    const resTime = new Date(`${reservation.date}T${reservation.time}`);
    const now = new Date();
    const diff = (resTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diff >= 2;
  }

  async onCancel(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Otkazivanje',
      message: 'Da li ste sigurni da želite otkazati rezervaciju?',
      buttons: [
        { text: 'Ne', role: 'cancel' },
        {
          text: 'Da',
          handler: async () => {
            const loading = await this.loadingCtrl.create({ message: 'Otkazivanje...' });
            await loading.present();
            this.reservationService.cancelReservation(id).subscribe(async () => {
              await loading.dismiss();
              this.reservationService.getReservations().subscribe();
            });
          }
        }
      ]
    });
    await alert.present();
  }
}