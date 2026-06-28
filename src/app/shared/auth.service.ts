import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  // ---- LOGIN ----
  async logIn(email: string, password: string): Promise<string> {
    const authRes: any = await firstValueFrom(
      this.http.post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`,
        { email, password, returnSecureToken: true },
      ),
    );

    const token = authRes.idToken;
    const uid = authRes.localId;

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', authRes.refreshToken);
    localStorage.setItem('uid', uid);
    localStorage.setItem('email', authRes.email);

    const userData: any = await firstValueFrom(
      this.http.get<any>(
        `${environment.firebaseConfig.databaseURL}/users/${uid}.json?auth=${token}`,
      ),
    );

    const role = (userData?.role ?? '').toLowerCase();
    localStorage.setItem('role', role);

    return role;
  }

  // ---- REGISTER ----
  async register(
    email: string,
    password: string,
    name: string,
    role: string,
  ): Promise<void> {
    const authRes: any = await firstValueFrom(
      this.http.post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseConfig.apiKey}`,
        { email, password, returnSecureToken: true },
      ),
    );

    const token = authRes.idToken;
    const uid = authRes.localId;

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', authRes.refreshToken);
    localStorage.setItem('uid', uid);
    localStorage.setItem('email', authRes.email);
    localStorage.setItem('role', role);

    await firstValueFrom(
      this.http.put(
        `${environment.firebaseConfig.databaseURL}/users/${uid}.json?auth=${token}`,
        { email, name, role },
      ),
    );
  }

  // ---- REFRESH TOKEN ----
  async refreshToken(): Promise<void> {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) return;

    const res: any = await firstValueFrom(
      this.http.post(
        `https://securetoken.googleapis.com/v1/token?key=${environment.firebaseConfig.apiKey}`,
        { grant_type: 'refresh_token', refresh_token: refresh }
      )
    );

    localStorage.setItem('token', res.id_token);
    localStorage.setItem('refreshToken', res.refresh_token);
  }

  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('uid');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('uid');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}