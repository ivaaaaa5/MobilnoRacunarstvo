import { Component, inject, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonButtons, IonBackButton, IonInput,
  LoadingController,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../shared/reservation.service';
import { TimeSlot } from '../../../shared/timeslot.model';
import { addIcons } from 'ionicons';
import { trash, add } from 'ionicons/icons';

@Component({
  selector: 'app-timeslots',
  templateUrl: 'timeslots.page.html',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonButtons, IonBackButton, IonInput,
    FormsModule, CommonModule,
  ],
})
export class TimeSlotsPage implements OnInit {
  timeslots: TimeSlot[] = [];
  date = '';
  time = '';
  maxGuests = 4;

  private reservationService = inject(ReservationService);
  private loadingCtrl = inject(LoadingController);

  constructor() {
    addIcons({ trash, add });
  }

  ngOnInit() {
    this.loadSlots();
  }

  loadSlots() {
    this.reservationService.getTimeSlots().subscribe(slots => {
      this.timeslots = slots;
    });
  }

  async onAdd() {
    const loading = await this.loadingCtrl.create({ message: 'Dodavanje...' });
    await loading.present();
  const obs = await this.reservationService.addTimeSlot(this.date, this.time, this.maxGuests);
obs.subscribe(async () => {
  await loading.dismiss();
  this.date = '';
  this.time = '';
  this.loadSlots();
});
  }

  async onDelete(id: string) {
    const loading = await this.loadingCtrl.create({ message: 'Brisanje...' });
    await loading.present();
    const obs = await this.reservationService.deleteTimeSlot(id);
obs.subscribe(async () => {
  await loading.dismiss();
  this.loadSlots();
});
  }
}