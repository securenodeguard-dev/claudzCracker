import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="app-shell">
      <div class="fireworks-layer" aria-hidden="true">
        <span class="firework firework-one"></span>
        <span class="firework firework-two"></span>
        <span class="firework firework-three"></span>
        <span class="firework firework-four"></span>
        <span class="firework firework-five"></span>
        <span class="firework firework-six"></span>
      </div>
      <app-header></app-header>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }
      .app-shell {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        position: relative;
        isolation: isolate;
      }
      .app-main {
        flex: 1;
        position: relative;
        z-index: 1;
      }
      .fireworks-layer {
        position: fixed;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
      }
      .firework {
        --spark-color: #e7a83d;
        position: absolute;
        width: 112px;
        height: 112px;
        margin: -56px 0 0 -56px;
        border-radius: 50%;
        background: repeating-conic-gradient(
          from 2deg,
          transparent 0deg 11deg,
          var(--spark-color) 12deg 13deg,
          transparent 14deg 28deg
        );
        -webkit-mask: radial-gradient(circle, transparent 0 8%, #000 12% 52%, transparent 68%);
        mask: radial-gradient(circle, transparent 0 8%, #000 12% 52%, transparent 68%);
        filter: drop-shadow(0 0 5px var(--spark-color));
        opacity: 0;
        animation: firework-pop 4.2s ease-out infinite;
      }
      .firework::before {
        content: '';
        position: absolute;
        inset: 47px;
        border-radius: 50%;
        background: #fff7cf;
        box-shadow: 0 0 10px 4px var(--spark-color), 0 0 24px 8px var(--spark-color);
      }
      .firework::after {
        content: '';
        position: absolute;
        left: 53px;
        top: 7px;
        width: 5px;
        height: 22px;
        border-radius: 50%;
        background: linear-gradient(#fff8d6, var(--spark-color), transparent);
        transform-origin: 50% 49px;
        transform: rotate(22deg);
        filter: blur(0.5px);
      }
      .firework-one { --spark-color: #e85d75; top: 18%; left: 12%; animation-delay: 0s; }
      .firework-two { --spark-color: #f0b429; top: 34%; right: 15%; animation-delay: 1.8s; }
      .firework-three { --spark-color: #35b9a2; top: 58%; left: 23%; animation-delay: 3.4s; }
      .firework-four { --spark-color: #ef7b45; top: 70%; right: 28%; animation-delay: 2.5s; }
      .firework-five { --spark-color: #6d8fe8; top: 47%; right: 5%; animation-delay: 4.2s; }
      .firework-six { --spark-color: #d66bd0; top: 82%; left: 8%; animation-delay: 5s; }
      @keyframes firework-pop {
        0%, 100% { transform: scale(0.1); opacity: 0; }
        8% { transform: scale(0.18); opacity: 0.7; }
        17% { transform: scale(0.72); opacity: 0.88; }
        31% { transform: scale(1.08); opacity: 0.48; }
        48% { transform: scale(1.28); opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        .firework { animation: none; opacity: 0.08; }
      }
    `,
  ],
})
export class AppComponent {}
