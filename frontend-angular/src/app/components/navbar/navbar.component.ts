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
      <nav class="container mx-auto max-w-5xl floating-glass-nav pointer-events-auto transition-all shadow-[0_10px_40px_-10px_rgba(255,143,163,0.3)]">
        <div class="px-6 h-16 flex items-center justify-between">
          <!-- Brand -->
          <a routerLink="/" class="text-2xl font-extrabold flex items-center gap-2 text-[#ff8fa3] hover:opacity-80 transition-opacity" style="text-decoration: none;">
            <div class="w-10 h-10 bg-[#ffeaf0] rounded-full flex items-center justify-center transition-transform hover:scale-110">
              <lucide-icon [name]="SearchIcon" [size]="20" color="#ff8fa3"></lucide-icon>
            </div>
            <span class="tracking-tight">FindIt</span>
          </a>
          
          <!-- Navigation Links -->
          <div class="flex items-center gap-2 sm:gap-4">
            <a routerLink="/" routerLinkActive="bg-[#ff8fa3] text-white shadow-md border-transparent hover:!text-white hover:!bg-[#ff8fa3]" [routerLinkActiveOptions]="{exact: true}" 
               class="px-4 py-2 rounded-full text-gray-500 hover:text-[#ff8fa3] hover:bg-[#ffeaf0] flex items-center gap-2 transition-all font-bold border-2 border-transparent" style="text-decoration: none;">
              <lucide-icon [name]="HomeIcon" [size]="18"></lucide-icon>
              <span class="hidden sm:inline">Home</span>
            </a>
            
            <ng-container *ngIf="auth.user() as user; else guestLinks">
              <a routerLink="/dashboard" routerLinkActive="bg-[#ff8fa3] text-white shadow-md border-transparent hover:!text-white hover:!bg-[#ff8fa3]" 
                 class="px-4 py-2 rounded-full text-gray-500 hover:text-[#ff8fa3] hover:bg-[#ffeaf0] flex items-center gap-2 transition-all font-bold border-2 border-transparent" style="text-decoration: none;">
                <lucide-icon [name]="SearchIcon" [size]="18"></lucide-icon>
                <span class="hidden sm:inline">Browse</span>
              </a>
              <a routerLink="/post" routerLinkActive="bg-[#ff8fa3] text-white shadow-md border-transparent hover:!text-white hover:!bg-[#ff8fa3]" 
                 class="px-4 py-2 rounded-full text-gray-500 hover:text-[#ff8fa3] hover:bg-[#ffeaf0] flex items-center gap-2 transition-all font-bold border-2 border-transparent" style="text-decoration: none;">
                <lucide-icon [name]="PlusCircleIcon" [size]="18"></lucide-icon>
                <span class="hidden sm:inline">Post</span>
              </a>
              
              <div class="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>
              
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-[#69aee5] text-white flex items-center justify-center font-bold shadow-sm border-2 border-white">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <button (click)="auth.logout()" class="p-2 rounded-full text-gray-400 hover:text-[#ff8fa3] hover:bg-[#ffeaf0] transition-all bg-transparent border-none cursor-pointer" title="Logout">
                  <lucide-icon [name]="LogOutIcon" [size]="18"></lucide-icon>
                </button>
              </div>
            </ng-container>
  
            <ng-template #guestLinks>
              <div class="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200">
                <a routerLink="/login" class="text-gray-500 hover:text-[#ff8fa3] hover:bg-[#ffeaf0] rounded-full font-bold px-4 py-2 transition-all" style="text-decoration: none;">
                  Log In
                </a>
                <a routerLink="/register" class="bg-[#ff8fa3] hover:bg-[#ff758f] hover:-translate-y-0.5 shadow-md shadow-pink-200 text-white font-bold rounded-full text-sm px-6 py-2.5 transition-all" style="text-decoration: none;">
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
