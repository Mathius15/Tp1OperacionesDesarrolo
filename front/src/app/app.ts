import { Component, inject, signal } from '@angular/core';
import { Habitat } from './models/modelos';
import { HabitatsService } from './services/habitats.service';
import { ToastService } from './services/toast.service';
import { mensajeDeError } from './services/api-error';
import { HabitatsComponent } from './components/habitats/habitats.component';
import { EspeciesComponent } from './components/especies/especies.component';
import { Toast } from './components/toast';

// Componente raiz. Es el que carga los habitats una vez y los reparte entre
// las dos secciones, asi las dos ven la misma informacion.
@Component({
  selector: 'app-root',
  imports: [HabitatsComponent, EspeciesComponent, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly api = inject(HabitatsService);
  private readonly toast = inject(ToastService);

  readonly habitats = signal<Habitat[]>([]);

  constructor() {
    this.cargarHabitats();
  }

  async cargarHabitats(): Promise<void> {
    try {
      this.habitats.set(await this.api.listar());
    } catch (error) {
      this.toast.mostrar('No se pudo conectar con la API: ' + mensajeDeError(error), true);
    }
  }
}