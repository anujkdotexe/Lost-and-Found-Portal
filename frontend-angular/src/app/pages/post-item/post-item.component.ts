import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ItemService } from '../../services/item.service';
import { LucideAngularModule, UploadCloud, MapPin, Tag, Type, Calendar } from 'lucide-angular';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="max-w-3xl mx-auto animate-fade-in pb-20 pt-10 px-4">
      
      <!-- Login Prompt -->
      <div *ngIf="!auth.user()" class="text-center py-20 bg-white rounded-[3rem] shadow-bubbly flex flex-col items-center">
        <div class="w-24 h-24 bg-primary-light rounded-[2rem] flex items-center justify-center mb-6 animate-float">
          <lucide-icon [name]="TypeIcon" [size]="40" class="text-primary"></lucide-icon>
        </div>
        <h2 class="text-3xl font-extrabold text-[#2b2d42] mb-4">Oops! You need to log in</h2>
        <p class="text-gray-500 font-medium mb-8">Please log in to your account to post a lost or found item.</p>
        <button (click)="router.navigate(['/login'])" class="btn-primary py-3 px-8 text-lg">Go to Login</button>
      </div>

      <!-- Main Form -->
      <div *ngIf="auth.user()" class="bubbly-card p-8 md:p-12 relative overflow-hidden">
        
        <!-- Decorative Header Blur -->
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-primary-light/50 rounded-full blur-[3rem] pointer-events-none"></div>

        <div class="relative z-10">
          <h1 class="text-4xl font-extrabold text-[#2b2d42] mb-3">Report an Item ✨</h1>
          <p class="text-lg text-gray-500 font-medium mb-10 pb-8 border-b-2 border-gray-100">
            Help the community by sharing details about what you found or lost.
          </p>

          <form (submit)="handleSubmit($event)" class="space-y-8">
            
            <!-- Category Toggle (Segmented Control style) -->
            <div class="bg-gray-50 p-2 rounded-[2rem] flex gap-2 shadow-inner">
              <label class="flex-1 text-center py-4 rounded-[1.5rem] font-extrabold cursor-pointer transition-all duration-300 transform active:scale-95"
                     [ngClass]="formData.category === 'Lost' ? 'bg-primary text-white shadow-bubbly' : 'text-gray-400 hover:bg-gray-200/50 hover:text-gray-600'">
                <input type="radio" name="category" value="Lost" [(ngModel)]="formData.category" class="hidden">
                I Lost Something
              </label>
              <label class="flex-1 text-center py-4 rounded-[1.5rem] font-extrabold cursor-pointer transition-all duration-300 transform active:scale-95"
                     [ngClass]="formData.category === 'Found' ? 'bg-secondary text-white shadow-bubbly' : 'text-gray-400 hover:bg-gray-200/50 hover:text-gray-600'">
                <input type="radio" name="category" value="Found" [(ngModel)]="formData.category" class="hidden">
                I Found Something
              </label>
            </div>

            <!-- Title & Description -->
            <div class="space-y-6">
              <div class="group">
                <label class="flex items-center gap-2 text-sm font-extrabold text-gray-700 mb-2 ml-2 uppercase tracking-wide">
                  <lucide-icon [name]="TypeIcon" [size]="16" class="text-primary group-focus-within:text-primary transition-colors"></lucide-icon> 
                  Item Name
                </label>
                <input type="text" name="title" required [(ngModel)]="formData.title" 
                       class="input-bubbly" placeholder="e.g., Fluffy Orange Cat, Blue iPhone 13">
              </div>

              <div class="group">
                <label class="flex items-center gap-2 text-sm font-extrabold text-gray-700 mb-2 ml-2 uppercase tracking-wide">
                  <lucide-icon [name]="TagIcon" [size]="16" class="text-primary hover:text-primary transition-colors"></lucide-icon> 
                  Description
                </label>
                <textarea name="description" required [(ngModel)]="formData.description" 
                          rows="4" class="input-bubbly resize-none" placeholder="Provide helpful details..."></textarea>
              </div>
            </div>

            <!-- Location & Date -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-[2rem] border-2 border-gray-50">
              <div class="group">
                <label class="flex items-center gap-2 text-sm font-extrabold text-gray-700 mb-2 ml-2 uppercase tracking-wide">
                  <lucide-icon [name]="MapIcon" [size]="16" class="text-secondary"></lucide-icon> Location
                </label>
                <input type="text" name="location" required [(ngModel)]="formData.location" 
                       class="input-bubbly bg-white" placeholder="e.g., Central Park">
              </div>
              <div class="group">
                <label class="flex items-center gap-2 text-sm font-extrabold text-gray-700 mb-2 ml-2 uppercase tracking-wide">
                  <lucide-icon [name]="CalendarIcon" [size]="16" class="text-secondary"></lucide-icon> Date
                </label>
                <input type="date" name="date" required [(ngModel)]="formData.date" 
                       class="input-bubbly bg-white text-gray-600">
              </div>
            </div>

            <!-- Photo Upload -->
            <div>
              <label class="block text-sm font-extrabold text-gray-700 mb-3 ml-2 uppercase tracking-wide">Photo (Optional but super helpful)</label>
              <div class="relative group mt-1 flex justify-center px-6 pt-10 pb-12 border-4 border-dashed border-primary-light/50 bg-primary-light/10 rounded-[2rem] hover:border-primary hover:bg-primary-light/20 transition-all cursor-pointer overflow-hidden text-center">
                
                <div *ngIf="preview" class="absolute inset-0 w-full h-full p-2">
                  <img [src]="preview" alt="Preview" class="w-full h-full object-cover rounded-2xl shadow-sm">
                  <div class="absolute inset-2 rounded-2xl bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <lucide-icon [name]="UploadIcon" [size]="32" class="text-white mb-2"></lucide-icon>
                    <p class="text-white font-extrabold text-sm">Tap to change image</p>
                  </div>
                </div>
                
                <div *ngIf="!preview" class="space-y-3 flex flex-col items-center">
                  <div class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <lucide-icon [name]="UploadIcon" [size]="32"></lucide-icon>
                  </div>
                  <div class="text-lg text-gray-600 font-bold">
                    <span class="text-primary">Upload a cute photo</span> or drag and drop
                  </div>
                  <p class="text-sm font-semibold text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm">PNG, JPG up to 5MB</p>
                </div>
                
                <input type="file" name="image" accept="image/*" (change)="handleImageChange($event)" 
                       class="absolute inset-0 w-full h-full opacity-0 cursor-pointer outline-none">
              </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-6 border-t-2 border-gray-100">
              <button type="submit" [disabled]="loading" 
                      class="w-full py-5 text-xl btn-primary shadow-bubbly flex justify-center items-center gap-3">
                <div *ngIf="loading" class="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <span *ngIf="!loading">Post Item to Board ✨</span>
                <span *ngIf="loading">Publishing...</span>
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  `
})
export class PostItemComponent {
  auth = inject(AuthService);
  private itemService = inject(ItemService);
  router = inject(Router);

  formData = {
    title: '',
    description: '',
    category: 'Lost',
    location: '',
    date: new Date().toISOString().split('T')[0]
  };
  image: File | null = null;
  preview: string | null = null;
  loading = false;

  readonly TypeIcon = Type;
  readonly TagIcon = Tag;
  readonly MapIcon = MapPin;
  readonly CalendarIcon = Calendar;
  readonly UploadIcon = UploadCloud;

  handleImageChange(e: any) {
    const file = e.target.files[0];
    if (file) {
      this.image = file;
      this.preview = URL.createObjectURL(file);
    }
  }

  async handleSubmit(e: Event) {
    e.preventDefault();
    this.loading = true;

    const data = new FormData();
    Object.keys(this.formData).forEach(key => data.append(key, (this.formData as any)[key]));
    if (this.image) data.append('image', this.image);

    try {
      await this.itemService.createItem(data);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error posting item:', error);
      alert('Failed to post item. Please try again.');
    } finally {
      this.loading = false;
    }
  }
}
