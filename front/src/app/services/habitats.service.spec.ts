import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HabitatsService } from './habitats.service';
import { API_URL } from '../config/api';
import { Habitat } from '../models/modelos';

describe('HabitatsService', () => {
  let service: HabitatsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HabitatsService,
        provideHttpClient(),
        // Reemplaza el HttpClient real por uno que podemos inspeccionar.
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(HabitatsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('trae los habitats de la API', async () => {
    const habitats: Habitat[] = [
      { id: 1, nombre: 'Pampa', descripcion: null, cantidadEspecies: 3 },
    ];

    const promesa = service.listar();

    // Interceptamos la peticion: le decimos que URL y que respondemos.
    const req = httpMock.expectOne(`${API_URL}/habitats`);
    expect(req.request.method).toBe('GET');
    req.flush(habitats);

    expect(await promesa).toEqual(habitats);
  });
});