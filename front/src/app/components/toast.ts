import { Component, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    @if (toast.visible()) {
      <div class="toast" [class.error]="toast.esError()">
        {{ toast.mensaje() }}
      </div>
    }
  `,
  styles: `
    .toast {
      position: fixed;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      background: #1f2a24;
      color: #fff;
      padding: 0.75rem 1.25rem;
      border-radius: 6px;
      font-size: 0.9rem;
      max-width: 90%;
      z-index: 10;
    }

    .toast.error {
      background: #a12626;
    }
  `,
})
export class Toast {
  // inject() pide la instancia del service al contenedor de Angular.
  readonly toast = inject(ToastService);
}