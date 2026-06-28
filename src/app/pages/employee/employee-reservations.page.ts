import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonButtons, IonMenuButton, IonBadge,
  LoadingController,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../shared/reservation.service';
import { AuthService } from '../../shared/auth.service';
import { Reservation } from '../../shared/reservation.model';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { checkmarkCircle, calendar,trash } from 'ionicons/icons';


@Component({
  selector: 'app-employee-reservations',
  templateUrl: 'employee-reservations.page.html',
  standalone: true,

  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonButtons, IonMenuButton, IonBadge,
    CommonModule,
  ],
})
export class EmployeeReservationsPage implements OnInit, OnDestroy {
  reservations: Reservation[] = [];
  private sub = new Subscription();

  reservationService = inject(ReservationService);
  loadingCtrl = inject(LoadingController);
authService = inject(AuthService);
  constructor() {
    addIcons({ checkmarkCircle, calendar,trash });
  }

  async ngOnInit() {
    this.sub = this.reservationService.reservations.subscribe(res => {
      this.reservations = res;
    });
    await this.authService.refreshToken();
    this.reservationService.getReservations().subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
async onConfirmArrival(reservation: Reservation) {
  const loading = await this.loadingCtrl.create({ message: 'Potvrđivanje...' });
  await loading.present();
  this.reservationService.updateReservationStatus(reservation.id!, 'confirmed').subscribe(async () => {
    await loading.dismiss();
    this.reservationService.getReservations().subscribe();
  });
}

async onCancel(id: string) {
  const loading = await this.loadingCtrl.create({ message: 'Otkazivanje...' });
  await loading.present();
  this.reservationService.cancelReservation(id).subscribe(async () => {
    await loading.dismiss();
    this.reservationService.getReservations().subscribe();
  });
}
}