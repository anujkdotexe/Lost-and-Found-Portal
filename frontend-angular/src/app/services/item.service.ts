import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

export interface LostItem {
  _id?: string;
  owner: {
    _id: string;
    name: string;
    avatar?: string;
  };
  title: string;
  description: string;
  category: 'Lost' | 'Found';
  location: string;
  date: string;
  image?: string;
  status: 'Unclaimed' | 'Claimed';
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private getHeaders() {
    const token = this.auth.token;
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  async getLatestItems(): Promise<LostItem[]> {
    return firstValueFrom(this.http.get<LostItem[]>('/api/items/latest'));
  }

  async getAllItems(filter?: string, search?: string): Promise<LostItem[]> {
    let url = '/api/items';
    const params: any = {};
    if (filter && filter !== 'All') params.category = filter;
    if (search) params.search = search;
    
    const queryParams = new URLSearchParams(params).toString();
    if (queryParams) url += `?${queryParams}`;

    return firstValueFrom(this.http.get<LostItem[]>(url, { headers: this.getHeaders() }));
  }

  async getItemById(id: string): Promise<LostItem> {
    return firstValueFrom(this.http.get<LostItem>(`/api/items/${id}`, { headers: this.getHeaders() }));
  }

  async createItem(item: FormData): Promise<LostItem> {
    return firstValueFrom(this.http.post<LostItem>('/api/items', item, { headers: this.getHeaders() }));
  }

  async getMyItems(): Promise<LostItem[]> {
    return firstValueFrom(this.http.get<LostItem[]>('/api/items/myitems', { headers: this.getHeaders() }));
  }
}
