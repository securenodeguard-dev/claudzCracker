import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="shell" *ngIf="auth.getToken(); else loginLayout">
      <app-sidebar></app-sidebar>
      <main class="content"><router-outlet></router-outlet></main>
    </div>
    <ng-template #loginLayout>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    .shell { display: flex; min-height: 100vh; }
    .content { flex: 1; padding: 24px; max-width: 1100px; }
  `],
})
export class AppComponent {
  auth = inject(AuthService);
}
