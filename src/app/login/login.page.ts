import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
 import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [FormsModule, IonicModule, RouterLink],
})
export class LoginPage {
  email = '';
  password = '';

  private router = inject(Router);
  private http = inject(HttpClient);



async login() {
  try {
    // 1. Auth preko HTTP
    const authRes: any = await firstValueFrom(
      this.http.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`,
        { email: this.email, password: this.password, returnSecureToken: true }
      )
    );

    const token = authRes.idToken;
    const uid = authRes.localId;
    localStorage.setItem('token', token);
    localStorage.setItem('uid', uid);
    localStorage.setItem('email', authRes.email);

    // 2. Čitamo rolu iz baze
    this.http.get<any>(
      `${environment.firebaseConfig.databaseURL}/users/${uid}.json`
    ).subscribe(userData => {
      localStorage.setItem('role', userData.role.toLowerCase() ?? '');
      if (userData?.role === 'admin') {
        this.router.navigateByUrl('/admin');
      } else if (userData?.role === 'zaposleni') {
        this.router.navigateByUrl('/employee-reservations');
      } else {
        this.router.navigateByUrl('/home');
      }
    });

  } catch (e) {
    console.log('Greška login:', e);
  }

}}