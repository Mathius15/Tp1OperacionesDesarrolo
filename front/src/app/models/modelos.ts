export type TipoEspecie = 'flora' | 'fauna';

export interface Habitat {
  id: number;
  nombre: string;
  descripcion: string | null;
  cantidadEspecies: number;
}

export interface Especie {
  id: number;
  nombre: string;
  nombreCientifico: string | null;
  tipo: TipoEspecie;
  descripcion: string | null;
  endemica: boolean;
  habitatId: number;
  habitat: { id: number; nombre: string; descripcion: string | null };
}

// Lo que se manda al crear o modificar. La API responde con Especie.
export interface EspeciePayload {
  nombre: string;
  nombreCientifico: string | null;
  tipo: TipoEspecie;
  descripcion: string | null;
  endemica: boolean;
  habitatId: number;
}

export interface HabitatPayload {
  nombre: string;
  descripcion: string | null;
}

// Filtros de GET /especies. Todos opcionales.
export interface FiltrosEspecies {
  nombre?: string;
  tipo?: TipoEspecie;
  habitatId?: number;
  endemica?: boolean;
}