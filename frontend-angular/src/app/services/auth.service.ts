import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = signal<User | null>(null);
  loading = signal<boolean>(true);

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user.set(JSON.parse(storedUser));
    }
    this.loading.set(false);

    // Sync signal with localStorage
    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('user');
      }
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const data = await firstValueFrom(this.http.post<User>('/api/auth/login', { email, password }));
      this.user.set(data);
      return true;
    } catch (error: any) {
      console.error('Login error:', error.error?.message || error.message);
      return false;
    }
  }

  async register(name: string, email: string, password: string): Promise<boolean> {
    try {
      const data = await firstValueFrom(this.http.post<User>('/api/auth/register', { name, email, password }));
      this.user.set(data);
      return true;
    } catch (error: any) {
      console.error('Register error:', error.error?.message || error.message);
      return false;
    }
  }

  logout() {
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  get token(): string | undefined {
    return this.user()?.token;
  }
}
