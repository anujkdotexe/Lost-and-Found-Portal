import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { LucideAngularModule, Send, ArrowLeft } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';

export interface ChatMessage {
  sender: string;
  receiver: string | any;
  content: string;
  createdAt: string;
  itemId?: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="max-w-3xl mx-auto h-[85vh] flex flex-col bg-white rounded-[3rem] shadow-bubbly border-4 border-white overflow-hidden animate-fade-in mt-6">
      
      <!-- Header -->
      <div class="bg-primary-light/30 backdrop-blur-md border-b-2 border-primary-light/50 p-5 flex items-center justify-between z-10">
        <div class="flex items-center gap-4">
          <button (click)="goBack()" class="p-3 text-primary hover:bg-white/50 rounded-full transition-all border-none cursor-pointer hover:scale-110 shadow-sm">
            <lucide-icon [name]="ArrowLeftIcon" [size]="24"></lucide-icon>
          </button>
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-extrabold text-xl shadow-inner border-2 border-white">
              C
            </div>
            <div>
              <h2 class="text-2xl font-extrabold text-[#2b2d42] leading-none mb-1 hidden sm:block">Conversation</h2>
              <p class="text-sm text-primary font-bold">Safe & cute messaging ✨</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="flex-1 overflow-y-auto p-6 bg-[#f8fafc] flex flex-col gap-6 relative" #scrollContainer>
        
        <!-- Empty State -->
        <div *ngIf="messages.length === 0" class="flex-1 flex flex-col items-center justify-center text-center">
          <div class="bg-white w-24 h-24 rounded-[2rem] shadow-sm flex items-center justify-center mb-6 animate-bounce-hover">
            <lucide-icon [name]="SendIcon" [size]="40" class="text-secondary-light"></lucide-icon>
          </div>
          <h3 class="text-2xl font-extrabold text-[#2b2d42] mb-3">Say hello! 👋</h3>
          <p class="text-gray-500 font-medium text-lg max-w-xs">Start a friendly conversation about the item to help it get home.</p>
        </div>
        
        <!-- Messages -->
        <div *ngFor="let msg of messages; let i = index" 
             class="flex w-full animate-fade-in" 
             [style.animation-delay]="(i * 50) + 'ms'"
             [ngClass]="msg.sender === auth.user()?._id ? 'justify-end' : 'justify-start'">
             
          <div class="relative max-w-[80%] md:max-w-[70%] group">
            <div class="px-6 py-4 rounded-[2rem] shadow-sm text-[15px] font-medium leading-relaxed font-nunito"
                 [ngClass]="msg.sender === auth.user()?._id 
                   ? 'bg-primary text-white rounded-br-[0.5rem]' 
                   : 'bg-white text-gray-700 border-2 border-gray-100 rounded-bl-[0.5rem]'">
              {{ msg.content }}
            </div>
            <!-- Tail for the thought bubble aesthetic -->
            <div class="absolute bottom-0 w-4 h-4"
                 [ngClass]="msg.sender === auth.user()?._id ? '-right-2 bg-primary clip-bubble-right' : '-left-2 bg-gray-100 clip-bubble-left'"></div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-5 bg-white border-t-2 border-gray-50">
        <form (submit)="handleSendMessage($event)" class="flex gap-3 bg-gray-50 p-2 rounded-[2rem] border-2 border-transparent focus-within:border-primary-light transition-colors shadow-inner">
          <input type="text" [(ngModel)]="newMessage" name="newMessage"
                 placeholder="Type a friendly message..."
                 class="flex-1 bg-transparent border-none px-4 py-3 text-[16px] font-medium text-gray-700 focus:outline-none placeholder-gray-400">
          <button type="submit" [disabled]="!newMessage.trim()"
                  class="w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all border-none cursor-pointer shrink-0"
                  [ngClass]="newMessage.trim() 
                    ? 'bg-primary text-white hover:shadow-bubbly hover:scale-110 active:scale-95' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'">
            <lucide-icon [name]="SendIcon" [size]="20" [class.ml-1]="newMessage.trim()"></lucide-icon>
          </button>
        </form>
      </div>
    </div>
  `
})
export class ChatComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  auth = inject(AuthService);
  router = inject(Router);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages: ChatMessage[] = [];
  newMessage = '';
  socket?: Socket;
  userId = '';
  itemId: string | null = null;

  readonly SendIcon = Send;
  readonly ArrowLeftIcon = ArrowLeft;

  ngOnInit() {
    if (!this.auth.user()) {
      this.router.navigate(['/login']);
      return;
    }

    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.itemId = this.route.snapshot.queryParamMap.get('itemId');

    this.fetchMessages();
    this.initSocket();
  }

  async fetchMessages() {
    try {
      const token = this.auth.token;
      const data = await firstValueFrom(this.http.get<ChatMessage[]>(`/api/chat/${this.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }));
      this.messages = data;
      this.scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  initSocket() {
    const user = this.auth.user();
    if (!user) return;

    this.socket = io('/');
    
    this.socket.on('connect', () => {
      this.socket?.emit('join_room', user._id);
    });

    this.socket.on('receive_message', (msg: any) => {
      if (msg.sender === this.userId || msg.receiver === user._id) {
        this.messages.push(msg);
        this.scrollToBottom();
      }
    });
  }

  goBack() {
    window.history.back();
  }

  async handleSendMessage(e: Event) {
    e.preventDefault();
    if (!this.newMessage.trim()) return;

    const user = this.auth.user();
    if (!user) return;

    const msgData = {
      receiverId: this.userId,
      content: this.newMessage,
      itemId: this.itemId || null
    };

    try {
      const token = this.auth.token;
      const data = await firstValueFrom(this.http.post<ChatMessage>('/api/chat', msgData, {
        headers: { Authorization: `Bearer ${token}` }
      }));

      this.socket?.emit('send_message', {
        sender: user._id,
        receiver: this.userId,
        content: this.newMessage,
        createdAt: new Date()
      });

      this.messages.push({ ...data, sender: user._id });
      this.newMessage = '';
      this.scrollToBottom();
    } catch (error) {
      console.error("Failed to send message", error);
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  ngOnDestroy() {
    this.socket?.disconnect();
  }
}
