import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ItemService, LostItem } from '../../services/item.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, MapPin, Calendar, Heart, Share2, MessageCircle, AlertCircle, Info } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="max-w-5xl mx-auto animate-fade-in pb-20 pt-10 px-4">
      <!-- Loading State -->
      <div *ngIf="loading" class="flex flex-col justify-center items-center h-64 gap-4">
        <div class="w-16 h-16 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
        <p class="text-primary font-bold animate-pulse">Loading cute details...</p>
      </div>

      <!-- Not Found State -->
      <div *ngIf="!loading && !item" class="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center">
        <div class="bg-gray-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
          <lucide-icon [name]="HeartIcon" [size]="40" class="text-gray-300"></lucide-icon>
        </div>
        <h3 class="text-2xl font-extrabold text-[#2b2d42] mb-3">Item not found. 😿</h3>
        <button routerLink="/dashboard" class="mt-8 btn-outline">Back to Board</button>
      </div>

      <!-- Detail View -->
      <div *ngIf="!loading && item" class="flex flex-col lg:flex-row gap-8">
        
        <!-- Massive Rounded Image Container -->
        <div class="lg:w-1/2 relative">
          <div class="sticky top-24 rounded-[3rem] overflow-hidden shadow-bubbly bg-white border-8 border-white aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
            <img *ngIf="item.image" [src]="item.image" [alt]="item.title" class="w-full h-full object-cover transition-transform duration-700 hover:scale-105">
            <div *ngIf="!item.image" class="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400">
              <lucide-icon [name]="HeartIcon" [size]="64" class="mb-4 opacity-20 animate-pulse"></lucide-icon>
              <span class="font-extrabold text-xl opacity-50">No cute photo provided</span>
            </div>
            
            <!-- Floating Category Badge -->
            <div class="absolute top-6 left-6 px-6 py-2 rounded-full font-extrabold shadow-lg backdrop-blur-md"
                 [ngClass]="item.category === 'Lost' ? 'bg-primary/90 text-white' : 'bg-secondary/90 text-white'">
              {{ item.category }}
            </div>
            <!-- Floating Status Badge -->
            <div class="absolute top-6 right-6 px-4 py-2 rounded-full font-extrabold shadow-lg backdrop-blur-md bg-white/90"
                 [ngClass]="item.status === 'Claimed' ? 'text-green-500' : 'text-orange-400'">
              {{ item.status }} ✨
            </div>
          </div>
        </div>

        <!-- Info Bubbles -->
        <div class="lg:w-1/2 flex flex-col gap-6">
          <div class="flex justify-between items-start">
            <h1 class="text-4xl sm:text-5xl font-extrabold text-[#2b2d42] leading-tight tracking-tight">{{ item.title }}</h1>
          </div>

          <!-- Bubbly Info Cards Row -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-50 flex flex-col gap-2 hover:shadow-md transition-shadow">
              <div class="w-10 h-10 rounded-full bg-secondary-light text-secondary flex items-center justify-center">
                <lucide-icon [name]="MapIcon" [size]="20"></lucide-icon>
              </div>
              <span class="text-sm font-bold text-gray-400 uppercase tracking-widest">Location</span>
              <span class="font-bold text-gray-700">{{ item.location }}</span>
            </div>
            
            <div class="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-50 flex flex-col gap-2 hover:shadow-md transition-shadow">
              <div class="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
                <lucide-icon [name]="CalendarIcon" [size]="20"></lucide-icon>
              </div>
              <span class="text-sm font-bold text-gray-400 uppercase tracking-widest">Date {{ item.category === 'Lost' ? 'Lost' : 'Found' }}</span>
              <span class="font-bold text-gray-700">{{ item.date | date:'longDate' }}</span>
            </div>
          </div>

          <!-- Description Bubble -->
          <div class="bubbly-card bg-white mt-2">
            <h3 class="font-extrabold text-gray-800 text-xl mb-4 flex items-center gap-2">
              <lucide-icon [name]="InfoIcon" [size]="24" class="text-accent-peach"></lucide-icon>
              Details
            </h3>
            <p class="text-gray-600 font-medium leading-relaxed whitespace-pre-line text-lg">
              {{ item.description }}
            </p>
          </div>

          <!-- Interaction Section -->
          <div class="mt-auto bg-[#f8fafc] rounded-[2rem] p-6 border-2 border-white shadow-sm flex flex-col gap-6">
            <!-- Owner Bubble -->
            <div class="flex items-center gap-4 bg-white p-3 rounded-full shadow-sm max-w-fit pr-6">
              <div class="w-12 h-12 rounded-full bg-accent-mint text-[#2b2d42] flex items-center justify-center font-extrabold overflow-hidden shadow-inner text-xl">
                <img *ngIf="item.owner.avatar" [src]="item.owner.avatar" class="w-full h-full object-cover">
                <span *ngIf="!item.owner.avatar">{{ item.owner.name.charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <p class="text-gray-400 font-bold text-xs uppercase tracking-wider mb-0.5">Posted by</p>
                <p class="font-extrabold text-[#2b2d42] leading-none text-lg">{{ item.owner.name }}</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <ng-container *ngIf="auth.user() as currentUser; else guestView">
              <button *ngIf="currentUser._id !== item.owner._id && item.status !== 'Claimed'"
                      (click)="router.navigate(['/chat', item.owner._id], { queryParams: { itemId: item._id } })"
                      class="btn-primary py-4 text-xl w-full shadow-bubbly animate-pulse">
                <lucide-icon [name]="MessageIcon" [size]="24"></lucide-icon>
                Chat with {{ item.owner.name.split(' ')[0] }}
              </button>

              <div *ngIf="currentUser._id === item.owner._id" class="flex flex-col sm:flex-row gap-4 w-full">
                <button (click)="handleStatusUpdate()" 
                        class="btn-secondary py-3 flex-1 font-extrabold border-none cursor-pointer">
                  Mark as {{ item.status === 'Unclaimed' ? 'Claimed ✨' : 'Unclaimed' }}
                </button>
                <button (click)="handleDelete()" 
                        class="btn-outline border-red-200 text-red-500 hover:bg-red-50 hover:border-red-500 hover:text-red-500 py-3 font-extrabold">
                  Delete
                </button>
              </div>
            </ng-container>

            <!-- Guest View -->
            <ng-template #guestView>
              <div class="text-center p-6 bg-primary-light/30 rounded-3xl border border-primary-light">
                <p class="text-gray-600 font-bold mb-3">Want to help return this item?</p>
                <a routerLink="/login" class="btn-primary inline-flex">Log in to Chat</a>
              </div>
            </ng-template>
          </div>

        </div>
      </div>
    </div>
  `
})
export class ItemDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private itemService = inject(ItemService);
  private http = inject(HttpClient);
  auth = inject(AuthService);
  router = inject(Router);

  item: LostItem | null = null;
  loading = true;

  readonly HeartIcon = Heart;
  readonly ShareIcon = Share2;
  readonly AlertIcon = AlertCircle;
  readonly MapIcon = MapPin;
  readonly CalendarIcon = Calendar;
  readonly MessageIcon = MessageCircle;
  readonly InfoIcon = Info;

  ngOnInit() {
    this.loadItem();
  }

  async loadItem() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    try {
      this.item = await this.itemService.getItemById(id);
    } catch (error) {
      console.error('Failed to fetch item:', error);
    } finally {
      this.loading = false;
    }
  }

  async handleStatusUpdate() {
    if (!this.item || !this.item._id) return;
    try {
      const dataToUpdate = { status: this.item.status === 'Unclaimed' ? 'Claimed' : 'Unclaimed' };
      const token = this.auth.token;
      const updatedItem = await firstValueFrom(this.http.put<LostItem>(`/api/items/${this.item._id}`, dataToUpdate, {
        headers: { Authorization: `Bearer ${token}` }
      }));
      this.item.status = updatedItem.status;
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }

  async handleDelete() {
    if (!this.item || !this.item._id) return;
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const token = this.auth.token;
        await firstValueFrom(this.http.delete(`/api/items/${this.item._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }));
        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  }
}
