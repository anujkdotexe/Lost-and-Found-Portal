import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LostItem } from '../../services/item.service';
import { LucideAngularModule, MapPin, Calendar, Tag, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="bubbly-card h-full flex flex-col p-4 group cursor-pointer relative" [routerLink]="['/item', item._id]">
      <!-- Image Container (Polaroid style) -->
      <div class="relative rounded-2xl overflow-hidden mb-4 bg-gray-100 shadow-inner" style="height: 14rem; width: 100%;">
        <img [src]="item.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop'" 
             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
             [alt]="item.title">
             
        <!-- Cute Badges Over Image -->
        <div class="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <span class="shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
                [ngClass]="item.category === 'Lost' ? 'badge-lost' : 'badge-found'">
            {{ item.category }}
          </span>
          <span class="shadow-[0_4px_10px_rgba(0,0,0,0.15)] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider" 
                style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(5px);"
                [ngClass]="item.status === 'Claimed' ? 'text-green-600 border-2 border-green-200' : 'text-orange-500 border-2 border-orange-200'">
            {{ item.status }}
          </span>
        </div>
      </div>
      
      <!-- Content -->
      <div class="flex-grow flex flex-col">
        <h3 class="text-xl font-extrabold text-[#2b2d42] mb-3 line-clamp-1 group-hover:text-[#ff8fa3] transition-colors">
          {{ item.title }}
        </h3>
        
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-gray-500 text-sm font-semibold bg-gray-50 px-3 py-1.5 rounded-xl w-fit">
            <lucide-icon [name]="MapIcon" [size]="14" color="#ff8fa3"></lucide-icon>
            <span class="truncate max-w-[150px]">{{ item.location }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500 text-sm font-semibold px-1">
            <lucide-icon [name]="CalendarIcon" [size]="14"></lucide-icon>
            <span>{{ item.date | date:'mediumDate' }}</span>
          </div>
        </div>
        
        <!-- Footer / Owner -->
        <div class="pt-4 mt-auto border-t border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#eaf3ff] text-[#69aee5] flex items-center justify-center font-extrabold shadow-sm border-2 border-white overflow-hidden">
               <img *ngIf="item.owner.avatar" [src]="item.owner.avatar" class="w-full h-full object-cover">
               <span *ngIf="!item.owner.avatar">{{ item.owner.name.charAt(0) || 'U' }}</span>
            </div>
            <span class="text-xs font-bold text-gray-600 truncate max-w-[80px]">{{ item.owner.name || 'Unknown' }}</span>
          </div>
          <div class="w-8 h-8 rounded-full bg-[#ffeaf0] text-[#ff8fa3] flex items-center justify-center group-hover:bg-[#ff8fa3] group-hover:text-white transition-colors duration-300">
            <lucide-icon [name]="ArrowRightIcon" [size]="16" class="transition-colors group-hover:!text-white"></lucide-icon>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ItemCardComponent {
  @Input({ required: true }) item!: LostItem;

  readonly TagIcon = Tag;
  readonly MapIcon = MapPin;
  readonly CalendarIcon = Calendar;
  readonly ArrowRightIcon = ArrowRight;
}
