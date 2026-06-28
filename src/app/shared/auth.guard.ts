import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

export const clientGuard: CanActivateFn = () => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const authService = inject(AuthService);

  const token = authService.getToken();
  const uid = authService.getUserId();

  if (!token || !uid) {
    router.navigateByUrl('/login');
    return false;
  }

  return http
    .get<any>(
      `${environment.firebaseConfig.databaseURL}/users/${uid}.json?auth=${token}`,
    )
    .pipe(
      map((user) => {
        if (!user) {
          router.navigateByUrl('/login');
          return false;
        }
        return true;
      }),
    );
};

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const authService = inject(AuthService);

  const token = authService.getToken();
  const uid = authService.getUserId();

  if (!token || !uid) {
    router.navigateByUrl('/login');
    return false;
  }

  return http
    .get<any>(
      `${environment.firebaseConfig.databaseURL}/users/${uid}.json?auth=${token}`,
    )
    .pipe(
      map((user) => {
        if (user?.role === 'admin') return true;
        router.navigateByUrl('/home');
        return false;
      }),
    );
};
export const employeeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const authService = inject(AuthService);

  const token = authService.getToken();
  const uid = authService.getUserId();

  if (!token || !uid) {
    router.navigateByUrl('/login');
    return false;
  }

  return http
    .get<any>(
      `${environment.firebaseConfig.databaseURL}/users/${uid}.json?auth=${token}`,
    )
    .pipe(
      map((user) => {
        if (user?.role === 'zaposleni' || user?.role === 'admin') return true;
        router.navigateByUrl('/home');
        return false;
      }),
    );
};