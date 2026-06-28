import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservation } from './reservation.model';
import { BehaviorSubject, tap, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private _reservations = new BehaviorSubject<Reservation[]>([]);
  private authService = inject(AuthService);

  get reservations() {
    return this._reservations.asObservable();
  }

  private getToken(): string {
    return localStorage.getItem('token') ?? '';
  }

  getReservations() {

    const token = this.getToken();
    return this.http
      .get<{ [key: string]: Reservation }>(
        `${environment.firebaseConfig.databaseURL}/reservations.json?auth=${token}`
      )
      .pipe(
        tap((resData) => {
          const reservations: Reservation[] = [];
          for (const key in resData) {
            reservations.push({ ...resData[key], id: key });
          }
          this._reservations.next(reservations);
        })
      );
  }

  addReservation(date: string, time: string, numberOfGuests: number) {
    const token = this.getToken();
    const userId = localStorage.getItem('uid') ?? '';
    const userName = localStorage.getItem('email') ?? '';

    const newReservation: Reservation = {
      date, time, numberOfGuests,
      userId, userName,
      status: 'pending',
    };

    return this.http.post(
      `${environment.firebaseConfig.databaseURL}/reservations.json?auth=${token}`,
      newReservation
    );
  }

  cancelReservation(id: string) {
    const token = this.getToken();
    return this.http.delete(
      `${environment.firebaseConfig.databaseURL}/reservations/${id}.json?auth=${token}`
    );
  }

  updateReservationStatus(id: string, status: string) {
    const token = this.getToken();
    return this.http.patch(
      `${environment.firebaseConfig.databaseURL}/reservations/${id}.json?auth=${token}`,
      { status }
    );
  }

  getTimeSlots() {
    const token = this.getToken();
    return this.http
      .get<{ [key: string]: any }>(
        `${environment.firebaseConfig.databaseURL}/timeslots.json?auth=${token}`
      )
      .pipe(
        map((data) => {
          const slots = [];
          for (const key in data) {
            slots.push({ ...data[key], id: key });
          }
          return slots;
        })
      );
  }

  addTimeSlot(date: string, time: string, maxGuests: number) {
    const token = this.getToken();
    return this.http.post(
      `${environment.firebaseConfig.databaseURL}/timeslots.json?auth=${token}`,
      { date, time, available: true, maxGuests }
    );
  }

  deleteTimeSlot(id: string) {
    const token = this.getToken();
    return this.http.delete(
      `${environment.firebaseConfig.databaseURL}/timeslots/${id}.json?auth=${token}`
    );
  }
}