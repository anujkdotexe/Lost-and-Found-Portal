import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, UserPlus, User, Mail, Lock } from 'lucide-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  template: `
    <div class="max-w-md mx-auto py-12 px-6 bg-white glass rounded-3xl shadow-xl border border-white/40 animate-fade-in">
      <div class="text-center mb-10">
        <div class="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <lucide-icon [name]="UserPlusIcon" [size]="32"></lucide-icon>
        </div>
        <h2 class="text-3xl font-extrabold text-gray-800">Join FindIt</h2>
        <p class="text-gray-500 mt-2 font-medium">Create an account to help others</p>
      </div>

      <form (submit)="onSubmit()" class="space-y-6">
        <div class="relative">
          <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Name</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <lucide-icon [name]="UserIcon" [size]="18"></lucide-icon>
            </span>
            <input type="text" name="name" [(ngModel)]="name" required
                   class="input-field pl-10 focus:ring-2 focus:ring-primary/20 bg-gray-50/50" 
                   placeholder="Enter your name">
          </div>
        </div>

        <div class="relative">
          <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <lucide-icon [name]="MailIcon" [size]="18"></lucide-icon>
            </span>
            <input type="email" name="email" [(ngModel)]="email" required
                   class="input-field pl-10 focus:ring-2 focus:ring-primary/20 bg-gray-50/50" 
                   placeholder="Enter your email">
          </div>
        </div>

        <div class="relative">
          <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <lucide-icon [name]="LockIcon" [size]="18"></lucide-icon>
            </span>
            <input type="password" name="password" [(ngModel)]="password" required
                   class="input-field pl-10 focus:ring-2 focus:ring-primary/20 bg-gray-50/50" 
                   placeholder="Create a strong password">
          </div>
        </div>

        <div *ngIf="error" class="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100 animate-pulse">
          {{ error }}
        </div>

        <button type="submit" [disabled]="loading"
                class="btn-primary w-full py-3 text-lg font-extrabold shadow-md hover:shadow-lg disabled:opacity-50 flex gap-2">
          <div *ngIf="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {{ loading ? 'Creating Account...' : 'Sign Up' }}
        </button>
      </form>

      <div class="mt-8 text-center bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-3xl">
        <p class="text-gray-600 font-medium">Already have an account? 
          <a routerLink="/login" class="text-primary font-bold hover:underline">Log in now</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  loading = false;
  error = '';

  readonly UserPlusIcon = UserPlus;
  readonly UserIcon = User;
  readonly MailIcon = Mail;
  readonly LockIcon = Lock;

  async onSubmit() {
    this.loading = true;
    this.error = '';
    
    const success = await this.auth.register(this.name, this.email, this.password);
    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Registration failed. Please check your details.';
    }
    this.loading = false;
  }
}
