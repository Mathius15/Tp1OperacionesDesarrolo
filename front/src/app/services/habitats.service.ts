import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../config/api';
import { Habitat, HabitatPayload } from '../models/modelos';

// Un service por recurso. Cada metodo devuelve una Promise con los datos.
// Los componentes los llaman y actualizan sus signals.
@Injectable({ providedIn: 'root' })
export class HabitatsService {
  private readonly http = inject(HttpClient);

  listar(): Promise<Habitat[]> {
    return firstValueFrom(
      this.http.get<Habitat[]>(`${API_URL}/habitats`),
    );
  }

  obtener(id: number): Promise<Habitat> {
    return firstValueFrom(this.http.get<Habitat>(`${API_URL}/habitats/${id}`));
  }

  crear(datos: HabitatPayload): Promise<Habitat> {
    return firstValueFrom(
      this.http.post<Habitat>(`${API_URL}/habitats`, datos),
    );
  }

  actualizar(id: number, datos: HabitatPayload): Promise<Habitat> {
    return firstValueFrom(
      this.http.patch<Habitat>(`${API_URL}/habitats/${id}`, datos),
    );
  }

  borrar(id: number): Promise<Habitat> {
    return firstValueFrom(
      this.http.delete<Habitat>(`${API_URL}/habitats/${id}`),
    );
  }
}