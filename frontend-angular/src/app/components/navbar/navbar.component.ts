import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { 
  LucideAngularModule, 
  Search, 
  Home, 
  PlusCircle, 
  MessageCircle, 
  LogOut, 
  User 
} from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <div class="fixed top-4 left-0 w-full z-50 px-4 pointer-events-none">
      <nav class="container mx-auto max-w-5xl floating-glass-nav pointer-events-auto transition-all">
        <div class="px-6 h-16 flex items-center justify-between">
          <!-- Brand -->
          <a routerLink="/" class="text-2xl font-extrabold flex items-center gap-2 text-primary" style="text-decoration: none;">
            <div class="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center transition-transform hover:scale-110">
              <lucide-icon [name]="SearchIcon" [size]="20" class="text-primary"></lucide-icon>
            </div>
            <span class="tracking-tight">FindIt</span>
          </a>
          
          <!-- Navigation Links -->
          <div class="flex items-center gap-2 sm:gap-4">
            <a routerLink="/" routerLinkActive="bg-white text-primary shadow-sm" [routerLinkActiveOptions]="{exact: true}" 
               class="px-4 py-2 rounded-full text-gray-500 hover:text-primary hover:bg-white hover:shadow-sm flex items-center gap-2 transition-all font-bold" style="text-decoration: none;">
              <lucide-icon [name]="HomeIcon" [size]="18"></lucide-icon>
              <span class="hidden sm:inline">Home</span>
            </a>
            
            <ng-container *ngIf="auth.user() as user; else guestLinks">
              <a routerLink="/dashboard" routerLinkActive="bg-white text-primary shadow-sm" 
                 class="px-4 py-2 rounded-full text-gray-500 hover:text-primary hover:bg-white hover:shadow-sm flex items-center gap-2 transition-all font-bold" style="text-decoration: none;">
                <lucide-icon [name]="SearchIcon" [size]="18"></lucide-icon>
                <span class="hidden sm:inline">Browse</span>
              </a>
              <a routerLink="/post" routerLinkActive="bg-white text-primary shadow-sm" 
                 class="px-4 py-2 rounded-full text-gray-500 hover:text-primary hover:bg-white hover:shadow-sm flex items-center gap-2 transition-all font-bold" style="text-decoration: none;">
                <lucide-icon [name]="PlusCircleIcon" [size]="18"></lucide-icon>
                <span class="hidden sm:inline">Post</span>
              </a>
              
              <div class="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>
              
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center font-bold shadow-sm border-2 border-white">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <button (click)="auth.logout()" class="p-2 rounded-full text-gray-400 hover:text-primary hover:bg-white hover:shadow-sm transition-all bg-transparent border-none cursor-pointer" title="Logout">
                  <lucide-icon [name]="LogOutIcon" [size]="18"></lucide-icon>
                </button>
              </div>
            </ng-container>
  
            <ng-template #guestLinks>
              <div class="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-100">
                <a routerLink="/login" class="text-gray-500 hover:text-primary font-bold px-3 py-2 transition-colors" style="text-decoration: none;">
                  Log In
                </a>
                <a routerLink="/register" class="btn-primary text-sm px-5 py-2">
                  Sign Up
                </a>
              </div>
            </ng-template>
          </div>
        </div>
      </nav>
    </div>
  `
})
export class NavbarComponent {
  auth = inject(AuthService);

  readonly SearchIcon = Search;
  readonly HomeIcon = Home;
  readonly PlusCircleIcon = PlusCircle;
  readonly MessageCircleIcon = MessageCircle;
  readonly LogOutIcon = LogOut;
  readonly UserIcon = User;
}
