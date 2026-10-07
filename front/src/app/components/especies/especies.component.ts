import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Especie, FiltrosEspecies, Habitat, TipoEspecie } from '../../models/modelos';
import { EspeciesService } from '../../services/especies.service';
import { ToastService } from '../../services/toast.service';
import { mensajeDeError } from '../../services/api-error';

@Component({
  selector: 'app-especies',
  imports: [FormsModule],
  templateUrl: './especies.component.html',
  styleUrl: './especies.component.css',
})
export class EspeciesComponent {
  readonly habitats = input.required<Habitat[]>();
  readonly recargar = output<void>();

  private readonly api = inject(EspeciesService);
  private readonly toast = inject(ToastService);

  readonly especies = signal<Especie[]>([]);
  readonly editandoId = signal<number | null>(null);

  // Filtros (bound con [(ngModel)] en el template).
  fNombre = '';
  fTipo: TipoEspecie | '' = '';
  fHabitat: number | '' = '';
  fEndemica = false;

  // Estado del formulario.
  nombre = '';
  nombreCientifico = '';
  tipo: TipoEspecie = 'flora';
  habitatId: number | '' = '';
  descripcion = '';
  endemica = false;

  // Se corre apenas el componente aparece en pantalla.
  constructor() {
    this.cargar();
  }

  async cargar(): Promise<void> {
    try {
      this.especies.set(await this.api.listar(this.filtrosActuales()));
    } catch (error) {
      this.toast.mostrar(mensajeDeError(error), true);
    }
  }

  async guardar(): Promise<void> {
    if (this.habitatId === '') {
      this.toast.mostrar('Elegi un habitat', true);
      return;
    }

    const datos = {
      nombre: this.nombre,
      nombreCientifico: this.nombreCientifico,
      tipo: this.tipo,
      descripcion: this.descripcion,
      endemica: this.endemica,
      habitatId: Number(this.habitatId),
    };

    try {
      if (this.editandoId() === null) {
        await this.api.crear(datos);
        this.toast.mostrar('Especie creada');
      } else {
        await this.api.actualizar(this.editandoId()!, datos);
        this.toast.mostrar('Especie actualizada');
      }

      this.limpiarFormulario();
      await this.cargar();
      // El contador de especies por habitat cambio: el padre recarga habitats.
      this.recargar.emit();
    } catch (error) {
      this.toast.mostrar(mensajeDeError(error), true);
    }
  }

  async editar(especie: Especie): Promise<void> {
    try {
      const completa = await this.api.obtener(especie.id);

      this.editandoId.set(completa.id);
      this.nombre = completa.nombre;
      this.nombreCientifico = completa.nombreCientifico ?? '';
      this.tipo = completa.tipo;
      this.habitatId = completa.habitatId;
      this.descripcion = completa.descripcion ?? '';
      this.endemica = completa.endemica;
    } catch (error) {
      this.toast.mostrar(mensajeDeError(error), true);
    }
  }

  async borrar(especie: Especie): Promise<void> {
    if (!confirm(`Borrar la especie "${especie.nombre}"?`)) {
      return;
    }

    try {
      await this.api.borrar(especie.id);
      this.toast.mostrar('Especie eliminada');
      await this.cargar();
      this.recargar.emit();
    } catch (error) {
      this.toast.mostrar(mensajeDeError(error), true);
    }
  }

  limpiarFormulario(): void {
    this.editandoId.set(null);
    this.nombre = '';
    this.nombreCientifico = '';
    this.tipo = 'flora';
    this.habitatId = '';
    this.descripcion = '';
    this.endemica = false;
  }

  limpiarFiltros(): void {
    this.fNombre = '';
    this.fTipo = '';
    this.fHabitat = '';
    this.fEndemica = false;
    this.cargar();
  }

  // Traduce los campos del formulario al objeto que espera la API.
  private filtrosActuales(): FiltrosEspecies {
    return {
      nombre: this.fNombre || undefined,
      tipo: this.fTipo || undefined,
      habitatId: this.fHabitat === '' ? undefined : Number(this.fHabitat),
      endemica: this.fEndemica ? true : undefined,
    };
  }
}