import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PostItemComponent } from './pages/post-item/post-item.component';
import { ItemDetailComponent } from './pages/item-detail/item-detail.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'post', component: PostItemComponent },
  { path: 'item/:id', component: ItemDetailComponent },
  { path: 'chat/:userId', component: ChatComponent },
  { path: '**', redirectTo: '' }
];
