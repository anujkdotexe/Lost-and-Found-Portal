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

  private MOCK_ITEMS: LostItem[] = [
    {
      _id: '1',
      title: 'Fluffy Orange Cat',
      description: 'Lost near the central park entrance. Has a cute blue collar with a bell.',
      category: 'Lost',
      location: 'Central Park',
      date: new Date().toISOString(),
      status: 'Unclaimed',
      owner: { _id: 'u1', name: 'Alice Smith', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alice' }
    },
    {
      _id: '2',
      title: 'Silver Locket Necklace',
      description: 'Vintage silver locket, very sentimental. Dropped it somewhere near the library cafe.',
      category: 'Lost',
      location: 'Main St Library',
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'Unclaimed',
      owner: { _id: 'u2', name: 'Emma Watson', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Emma' }
    },
    {
      _id: '3',
      title: 'Pastel Blue Hydroflask',
      description: 'Water bottle covered in cute Ghibli stickers. Left it on the bleachers.',
      category: 'Lost',
      location: 'Campus Gym',
      date: new Date(Date.now() - 172800000).toISOString(),
      status: 'Unclaimed',
      owner: { _id: 'u3', name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=John' }
    }
  ];

  async getLatestItems(): Promise<LostItem[]> {
    return this.MOCK_ITEMS.slice(0, 3);
  }

  async getAllItems(filter?: string, search?: string): Promise<LostItem[]> {
    let result = [...this.MOCK_ITEMS];
    if (filter && filter !== 'All') {
      result = result.filter(item => item.category === filter);
    }
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(s) || 
        item.description.toLowerCase().includes(s) || 
        item.location.toLowerCase().includes(s)
      );
    }
    return result;
  }

  async getItemById(id: string): Promise<LostItem> {
    const item = this.MOCK_ITEMS.find(i => i._id === id);
    if (item) return item;
    return firstValueFrom(this.http.get<LostItem>(`/api/items/${id}`, { headers: this.getHeaders() }));
  }

  async createItem(item: FormData): Promise<LostItem> {
    return firstValueFrom(this.http.post<LostItem>('/api/items', item, { headers: this.getHeaders() }));
  }

  async getMyItems(): Promise<LostItem[]> {
    return firstValueFrom(this.http.get<LostItem[]>('/api/items/myitems', { headers: this.getHeaders() }));
  }
}
