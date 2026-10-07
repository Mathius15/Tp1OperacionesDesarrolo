import { Injectable, signal } from '@angular/core';

// Estado global minimo: el ultimo mensaje que se le muestra al usuario.
// Un signal es como una variable que Angular sabe que tiene que mirar:
// cuando cambia, la vista se actualiza sola.
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly mensaje = signal<string>('');
  readonly esError = signal(false);
  readonly visible = signal(false);

  private temporizador: ReturnType<typeof setTimeout> | null = null;

  mostrar(texto: string, esError = false): void {
    this.mensaje.set(texto);
    this.esError.set(esError);
    this.visible.set(true);

    if (this.temporizador) {
      clearTimeout(this.temporizador);
    }

    this.temporizador = setTimeout(() => this.visible.set(false), 3000);
  }
}