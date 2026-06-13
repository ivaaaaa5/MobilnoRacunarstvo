import { Component, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonButtons, IonMenuButton,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { addCircle, calendar, people } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonButtons, IonMenuButton,
    CommonModule,
  ],
})
export class HomePage {
  role = '';
  private router = inject(Router);

  constructor() {
    addIcons({ addCircle, calendar, people });
  }

  ionViewWillEnter() {
    this.role = localStorage.getItem('role') ?? '';
  }

  goToReservations() {
    this.router.navigateByUrl('/employee-reservations');
  }

  goToMyReservations() {
    this.router.navigateByUrl('/reservations');
  }

  goToNewReservation() {
    this.router.navigateByUrl('/new-reservation');
  }

  goToAdmin() {
    this.router.navigateByUrl('/admin');
  }
}