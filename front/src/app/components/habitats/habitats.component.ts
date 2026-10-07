import {
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Habitat } from '../../models/modelos';
import { HabitatsService } from '../../services/habitats.service';
import { ToastService } from '../../services/toast.service';
import { mensajeDeError } from '../../services/api-error';

// Componente de la seccion "Habitats": formulario (alta/edicion) + listado.
// Los habitats se los pasa el componente padre (App) mediante un @Input,
// y avisa con un @Output cuando algo cambio, para que el padre los recargue.
@Component({
  selector: 'app-habitats',
  imports: [FormsModule],
  templateUrl: './habitats.component.html',
  styleUrl: './habitats.component.css',
})
export class HabitatsComponent {
  // input() / output() son la forma moderna de pasar datos entre
  // componentes en Angular.
  readonly habitats = input.required<Habitat[]>();
  readonly recargar = output<void>();

  private readonly api = inject(HabitatsService);
  private readonly toast = inject(ToastService);

  // Estado del formulario.
  readonly editandoId = signal<number | null>(null);
  nombre = '';
  descripcion = '';

  async guardar(): Promise<void> {
    try {
      if (this.editandoId() === null) {
        await this.api.crear({ nombre: this.nombre, descripcion: this.descripcion });
        this.toast.mostrar('Habitat creado');
      } else {
        await this.api.actualizar(this.editandoId()!, {
          nombre: this.nombre,
          descripcion: this.descripcion,
        });
        this.toast.mostrar('Habitat actualizado');
      }

      this.limpiarFormulario();
      this.recargar.emit();
    } catch (error) {
      this.toast.mostrar(mensajeDeError(error), true);
    }
  }

  async editar(habitat: Habitat): Promise<void> {
    try {
      const completo = await this.api.obtener(habitat.id);

      this.editandoId.set(completo.id);
      this.nombre = completo.nombre;
      this.descripcion = completo.descripcion ?? '';
    } catch (error) {
      this.toast.mostrar(mensajeDeError(error), true);
    }
  }

  async borrar(habitat: Habitat): Promise<void> {
    if (!confirm(`Borrar el habitat "${habitat.nombre}"?`)) {
      return;
    }

    try {
      await this.api.borrar(habitat.id);
      this.toast.mostrar('Habitat eliminado');
      this.recargar.emit();
    } catch (error) {
      // Si tiene especies la API responde 409 y el mensaje lo explica.
      this.toast.mostrar(mensajeDeError(error), true);
    }
  }

  limpiarFormulario(): void {
    this.editandoId.set(null);
    this.nombre = '';
    this.descripcion = '';
  }
}