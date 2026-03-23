import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemCardComponent } from '../../components/item-card/item-card.component';
import { LucideAngularModule, Search, Filter, Compass } from 'lucide-angular';
import { ItemService, LostItem } from '../../services/item.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ItemCardComponent, LucideAngularModule],
  template: `
    <div class="animate-fade-in pb-20 pt-10 px-4 max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-12 text-center max-w-2xl mx-auto">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-[#ffeaf0] rounded-full mb-6 animate-float shadow-sm">
          <lucide-icon [name]="CompassIcon" [size]="36" color="#ff8fa3"></lucide-icon>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold text-[#2b2d42] mb-4 tracking-tight">Community Board</h1>
        <p class="text-lg text-gray-500 font-semibold">Browse reported missing and found items around the community.</p>
      </div>

      <!-- Floating Filter & Search Pill -->
      <div class="bg-white/80 backdrop-blur-xl p-3 border-4 border-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(255,143,163,0.3)] mb-12 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-24 z-40 transition-all">
        <!-- Filter Tabs -->
        <div class="flex w-full md:w-auto p-1.5 bg-gray-50 rounded-full border-2 border-gray-100">
          <button *ngFor="let cat of ['All', 'Lost', 'Found']"
                  (click)="setFilter(cat)"
                  class="px-6 py-2.5 rounded-full text-sm font-extrabold transition-all border-none cursor-pointer flex-1 md:flex-none text-center"
                  [ngClass]="getFilterClass(cat)">
            {{ cat }}
          </button>
        </div>

        <!-- Search Bar -->
        <form (submit)="handleSearch($event)" class="relative w-full md:w-96 flex">
          <input type="text" placeholder="Search for items, locations, or tags..."
                 [(ngModel)]="searchTerm" name="searchTerm"
                 class="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] py-3 pl-6 pr-14 text-sm font-semibold focus:border-[#ff8fa3] focus:bg-white transition-all outline-none shadow-inner">
          <button type="submit" class="absolute right-2 top-1.5 p-2 bg-[#ff8fa3] text-white rounded-full hover:scale-110 transition-transform border-none cursor-pointer shadow-md">
            <lucide-icon [name]="SearchIcon" [size]="18" color="#ffffff"></lucide-icon>
          </button>
        </form>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading; else itemsGrid" class="flex flex-col justify-center items-center py-20 gap-4">
        <div class="w-16 h-16 border-4 border-[#ffeaf0] border-t-[#ff8fa3] rounded-full animate-spin"></div>
        <p class="text-[#ff8fa3] font-bold animate-pulse">Fetching items...</p>
      </div>

      <ng-template #itemsGrid>
        <!-- Empty State -->
        <div *ngIf="items.length === 0; else showItems" 
             class="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center">
          <div class="bg-gray-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
            <lucide-icon [name]="FilterIcon" [size]="40" color="#d1d5db"></lucide-icon>
          </div>
          <h3 class="text-2xl font-extrabold text-[#2b2d42] mb-3">No cute items found</h3>
          <p class="text-gray-500 font-medium text-lg">Try adjusting your search or filter criteria.</p>
          <button (click)="setFilter('All'); searchTerm=''" class="mt-8 px-6 py-3 rounded-full bg-white border-2 border-[#ff8fa3] text-[#ff8fa3] font-bold hover:bg-[#ffeaf0] cursor-pointer transition-colors">Clear Filters</button>
        </div>

        <!-- Grid -->
        <ng-template #showItems>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in delay-100">
            <app-item-card *ngFor="let item of items" [item]="item" class="h-full"></app-item-card>
          </div>
        </ng-template>
      </ng-template>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private itemService = inject(ItemService);
  
  items: LostItem[] = [];
  loading = true;
  filter = 'All';
  searchTerm = '';

  readonly CompassIcon = Compass;
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;

  ngOnInit() {
    this.fetchItems();
  }

  async fetchItems() {
    this.loading = true;
    try {
      this.items = await this.itemService.getAllItems(this.filter, this.searchTerm);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setTimeout(() => this.loading = false, 150); // slight delay just for aesthetic spinner heartbeat
    }
  }

  setFilter(cat: string) {
    this.filter = cat;
    this.fetchItems();
  }

  handleSearch(e: Event) {
    e.preventDefault();
    this.fetchItems();
  }

  getFilterClass(cat: string) {
    if (this.filter !== cat) return 'text-gray-500 hover:text-[#ff8fa3]';
    
    if (cat === 'Lost') return 'bg-[#ffeaf0] text-[#ff8fa3] shadow-sm';
    if (cat === 'Found') return 'bg-[#eaf3ff] text-[#69aee5] shadow-sm';
    return 'bg-white text-[#2b2d42] shadow-sm';
  }
}
