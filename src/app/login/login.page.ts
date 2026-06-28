import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth.service';

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
  private authService = inject(AuthService);

  async login() {
    const role = await this.authService.logIn(this.email, this.password);

    if (role === 'admin') {
      this.router.navigateByUrl('/admin');
    } else if (role === 'zaposleni') {
      this.router.navigateByUrl('/employee-reservations');
    } else {
      this.router.navigateByUrl('/home');
    }
  }
}