import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Reservation } from './reservation.model';
import { BehaviorSubject, tap,map } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private http = inject(HttpClient);
  private auth = inject(Auth);

  private _reservations = new BehaviorSubject<Reservation[]>([]);

  get reservations() {
    return this._reservations.asObservable();
  }

  getReservations() {
    return this.http
      .get<{ [key: string]: Reservation }>(
        `${environment.firebaseConfig.databaseURL}/reservations.json`
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
    const userId = this.auth.currentUser?.uid ?? '';
    const newReservation: Reservation = {
      date, time, numberOfGuests,
      userId,
      userName: this.auth.currentUser?.email ?? '',
      status: 'pending',
    };
    return this.http.post(
      `${environment.firebaseConfig.databaseURL}/reservations.json`,
      newReservation
    );
  }

  cancelReservation(id: string) {
    return this.http.delete(
      `${environment.firebaseConfig.databaseURL}/reservations/${id}.json`
    );
  }
  updateReservationStatus(id: string, status: string) {
  return this.http.patch(
    `${environment.firebaseConfig.databaseURL}/reservations/${id}.json`,
    { status }
  );
}
getTimeSlots() {
  return this.http
    .get<{ [key: string]: any }>(
      `${environment.firebaseConfig.databaseURL}/timeslots.json`
    )
    .pipe(
      map(data => {
        const slots = [];
        for (const key in data) {
          slots.push({ ...data[key], id: key });
        }
        return slots;
      })
    );
}

addTimeSlot(date: string, time: string, maxGuests: number) {
  return this.http.post(
    `${environment.firebaseConfig.databaseURL}/timeslots.json`,
    { date, time, available: true, maxGuests }
  );
}

deleteTimeSlot(id: string) {
  return this.http.delete(
    `${environment.firebaseConfig.databaseURL}/timeslots/${id}.json`
  );
}
}