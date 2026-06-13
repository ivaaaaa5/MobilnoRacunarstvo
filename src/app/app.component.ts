import { Component } from '@angular/core';
import {
  IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar,
  IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonIcon, IonMenuToggle,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { home, calendar, logOut, people, statsChart } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar,
    IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonIcon, IonMenuToggle, RouterLink, CommonModule,
  ],
})
export class AppComponent {
  get role(): string {
    return localStorage.getItem('role') ?? '';
  }

  constructor() {
    addIcons({ home, calendar, logOut, people, statsChart });
  }
}