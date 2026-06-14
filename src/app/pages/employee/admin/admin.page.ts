import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonButtons, IonMenuButton, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, LoadingController,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../../shared/reservation.service';
import { Reservation } from '../../../shared/reservation.model';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { trash, statsChart, people, calendar } from 'ionicons/icons';

@Component({
  selector: 'app-admin',
  templateUrl: 'admin.page.html',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonButtons, IonMenuButton, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent,
    CommonModule, RouterLink,
  ],
})
export class AdminPage implements OnInit, OnDestroy {
  reservations: Reservation[] = [];
  private sub = new Subscription();
  private reservationService = inject(ReservationService);
  private loadingCtrl = inject(LoadingController);

  get totalReservations() { return this.reservations.length; }
  get confirmedReservations() { return this.reservations.filter(r => r.status === 'confirmed').length; }
  get pendingReservations() { return this.reservations.filter(r => r.status === 'pending').length; }

  constructor() {
    addIcons({ trash, statsChart, people, calendar });
  }

  ngOnInit() {
    this.sub = this.reservationService.reservations.subscribe(res => {
      this.reservations = res;
    });
    this.reservationService.getReservations().subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async onDelete(id: string) {
    const loading = await this.loadingCtrl.create({ message: 'Brisanje...' });
    await loading.present();
    this.reservationService.cancelReservation(id).subscribe(async () => {
      await loading.dismiss();
      this.reservationService.getReservations().subscribe();
    });
  }
}