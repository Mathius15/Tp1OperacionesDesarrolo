import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../config/api';
import { Especie, EspeciePayload, FiltrosEspecies } from '../models/modelos';

@Injectable({ providedIn: 'root' })
export class EspeciesService {
  private readonly http = inject(HttpClient);

  listar(filtros: FiltrosEspecies = {}): Promise<Especie[]> {
    // HttpParams se encarga de.url-encodear los valores.
    let params = new HttpParams();

    if (filtros.nombre) {
      params = params.set('nombre', filtros.nombre);
    }
    if (filtros.tipo) {
      params = params.set('tipo', filtros.tipo);
    }
    if (filtros.habitatId) {
      params = params.set('habitatId', filtros.habitatId);
    }
    if (filtros.endemica !== undefined) {
      params = params.set('endemica', String(filtros.endemica));
    }

    return firstValueFrom(
      this.http.get<Especie[]>(`${API_URL}/especies`, { params }),
    );
  }

  obtener(id: number): Promise<Especie> {
    return firstValueFrom(
      this.http.get<Especie>(`${API_URL}/especies/${id}`),
    );
  }

  crear(datos: EspeciePayload): Promise<Especie> {
    return firstValueFrom(
      this.http.post<Especie>(`${API_URL}/especies`, datos),
    );
  }

  actualizar(id: number, datos: EspeciePayload): Promise<Especie> {
    return firstValueFrom(
      this.http.patch<Especie>(`${API_URL}/especies/${id}`, datos),
    );
  }

  borrar(id: number): Promise<Especie> {
    return firstValueFrom(
      this.http.delete<Especie>(`${API_URL}/especies/${id}`),
    );
  }
}