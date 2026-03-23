import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ItemService, LostItem } from '../../services/item.service';
import { ItemCardComponent } from '../../components/item-card/item-card.component';
import { LucideAngularModule, Search, Info, CheckCircle, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ItemCardComponent, LucideAngularModule],
  template: `
    <div class="space-y-24 pt-20 pb-16">
      
      <!-- Hero Section -->
      <section class="relative max-w-5xl mx-auto rounded-[3rem] p-12 lg:p-20 text-center overflow-hidden" 
               style="background: linear-gradient(145deg, var(--color-primary-light), #fff0f3);">
               
        <!-- Decorative Blobs -->
        <div class="absolute top-0 left-0 w-64 h-64 bg-white/40 rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-blob"></div>
        <div class="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-80 h-80 bg-secondary-light/60 rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div class="relative z-10 max-w-3xl mx-auto">
          <div class="inline-flex items-center justify-center p-4 bg-white rounded-3xl shadow-sm mb-8 animate-fade-in">
            <h1 class="text-4xl md:text-6xl font-extrabold text-[#2b2d42] tracking-tight leading-tight">
              Lost it? <br/> <span class="text-primary">Find it.</span> Return it.
            </h1>
          </div>
          <p class="text-xl text-gray-600 mb-10 leading-relaxed font-semibold max-w-2xl mx-auto animate-fade-in delay-100">
            A cute and community-driven platform to help you track down missing items or reunite found treasures with their owners.
          </p>
          
          <div class="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in delay-200">
            <a routerLink="/post" class="btn-primary text-lg px-8 py-4">
              <lucide-icon [name]="SearchIcon" [size]="20"></lucide-icon>
              Report an Item
            </a>
            <a routerLink="/dashboard" class="btn-secondary text-lg px-8 py-4">
              Browse Board
              <lucide-icon [name]="ArrowRightIcon" [size]="20"></lucide-icon>
            </a>
          </div>
        </div>
      </section>

      <!-- Stats / How it works Section -->
      <section class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <div class="bubbly-card text-center flex flex-col items-center">
          <div class="w-20 h-20 bg-primary-light text-primary rounded-[2rem] flex items-center justify-center mb-6 animate-float">
            <lucide-icon [name]="SearchIcon" [size]="36"></lucide-icon>
          </div>
          <h3 class="text-2xl font-extrabold mb-3 text-[#2b2d42]">Report Lost</h3>
          <p class="text-gray-500 font-medium">Create a cute listing for an item you've misplaced. Add photos and locations easily.</p>
        </div>
        
        <div class="bubbly-card text-center flex flex-col items-center" style="animation-delay: 100ms;">
          <div class="w-20 h-20 bg-secondary-light text-secondary rounded-[2rem] flex items-center justify-center mb-6 animate-float animation-delay-2000">
            <lucide-icon [name]="InfoIcon" [size]="36"></lucide-icon>
          </div>
          <h3 class="text-2xl font-extrabold mb-3 text-[#2b2d42]">Report Found</h3>
          <p class="text-gray-500 font-medium">Found something? Upload it securely and help connect it back to its owner.</p>
        </div>
        
        <div class="bubbly-card text-center flex flex-col items-center" style="animation-delay: 200ms;">
          <div class="w-20 h-20 bg-accent-peach-light text-[#ffab6e] rounded-[2rem] flex items-center justify-center mb-6 animate-float animation-delay-4000">
            <lucide-icon [name]="CheckCircleIcon" [size]="36"></lucide-icon>
          </div>
          <h3 class="text-2xl font-extrabold mb-3 text-[#2b2d42]">Connect</h3>
          <p class="text-gray-500 font-medium">Chat securely in real-time to arrange a safe and happy return.</p>
        </div>
      </section>

      <!-- Latest Items Section -->
      <section class="max-w-5xl mx-auto px-4 pb-12">
        <div class="flex items-center justify-between mb-10">
          <h2 class="text-3xl font-extrabold text-[#2b2d42]">Community Board</h2>
          <a routerLink="/dashboard" class="btn-outline text-sm px-6 py-2">
            View All <lucide-icon [name]="ArrowRightIcon" [size]="16" class="ml-1"></lucide-icon>
          </a>
        </div>
        
        <div *ngIf="loading; else itemsGrid" class="flex justify-center items-center py-20">
          <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <ng-template #itemsGrid>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <app-item-card *ngFor="let item of items" [item]="item" class="h-full"></app-item-card>
          </div>
          <div *ngIf="items.length === 0" class="text-center py-24 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <p class="text-gray-500 text-xl font-bold">No active items found yet. Be the first to post!</p>
          </div>
        </ng-template>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  private itemService = inject(ItemService);
  
  items: LostItem[] = [];
  loading = true;

  readonly SearchIcon = Search;
  readonly ArrowRightIcon = ArrowRight;
  readonly InfoIcon = Info;
  readonly CheckCircleIcon = CheckCircle;

  ngOnInit() {
    this.loadItems();
  }

  async loadItems() {
    try {
      this.items = await this.itemService.getLatestItems();
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      this.loading = false;
    }
  }
}
