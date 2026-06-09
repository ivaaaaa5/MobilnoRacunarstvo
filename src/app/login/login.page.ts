import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { inject } from '@angular/core';
import {Router} from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class LoginPage {
  email = '';
  password = '';

  private auth = inject(Auth);
  private router=inject(Router)
  async login() {
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      console.log('Login OK ✔️');
      this.router.navigateByUrl('/home')
    } catch (e) {
      console.log('Greška login:', e);
    }
  }
}