import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habitat } from '../habitats/habitat.entity';
import { Especie, TipoEspecie } from '../especies/especie.entity';

interface SemillaHabitat {
  nombre: string;
  descripcion: string;
}

interface SemillaEspecie {
  nombre: string;
  nombreCientifico: string;
  tipo: TipoEspecie;
  descripcion: string;
  endemica: boolean;
  habitat: string; // nombre del habitat, no el id (lo buscamos abajo)
}

const HABITATS: SemillaHabitat[] = [
  {
    nombre: 'Sierra del El Iguel',
    descripcion: 'Sierra al oeste de la ciudad, con bosques y senderos.',
  },
  {
    nombre: 'Laguna de Los Mulgazas',
    descripcion: 'Laguna periurbana, refugio de aves acuaticas.',
  },
  {
    nombre: 'Parque de la Villa',
    descripcion: 'Parque urbano en el centro de Tandil.',
  },
  {
    nombre: 'Pampa',
    descripcion: 'Llanura que rodea la ciudad, al sur de Buenos Aires.',
  },
];

const ESPECIES: SemillaEspecie[] = [
  {
    nombre: 'Calafo',
    nombreCientifico: 'Phenicopternus chilensis',
    tipo: 'fauna',
    descripcion: 'Ave marina del Plata.',
    endemica: false,
    habitat: 'Laguna de Los Mulgazas',
  },
  {
    nombre: 'Mirla',
    nombreCientifico: 'Larus maculipennis',
    tipo: 'fauna',
    descripcion: 'Gaviota de la costa.',
    endemica: false,
    habitat: 'Laguna de Los Mulgazas',
  },
  {
    nombre: 'Yetiayapa',
    nombreCientifico: 'Nyctibius auritus',
    tipo: 'fauna',
    descripcion: 'Ave nocturna deivore.',
    endemica: true,
    habitat: 'Sierra del El Iguel',
  },
  {
    nombre: 'Hornero',
    nombreCientifico: 'Furnarius rufus',
    tipo: 'fauna',
    descripcion: 'Nidos de barro en los arboles.',
    endemica: false,
    habitat: 'Parque de la Villa',
  },
  {
    nombre: 'Ombu',
    nombreCientifico: 'Phytolacca octandra',
    tipo: 'flora',
    descripcion: 'Arbol de rapido crecimiento.',
    endemica: true,
    habitat: 'Pampa',
  },
  {
    nombre: 'Tala',
    nombreCientifico: 'Celtis taylori',
    tipo: 'flora',
    descripcion: 'Arbol nativo de sombra.',
    endemica: true,
    habitat: 'Pampa',
  },
  {
    nombre: 'Chanar',
    nombreCientifico: 'Geoffroea decorticans',
    tipo: 'flora',
    descripcion: 'Arbol de corteza oscura.',
    endemica: true,
    habitat: 'Pampa',
  },
  {
    nombre: 'Oreja de zorro',
    nombreCientifico: 'Stachys grammotricha',
    tipo: 'flora',
    descripcion: 'Hierba aromatica.',
    endemica: false,
    habitat: 'Sierra del El Iguel',
  },
  {
    nombre: 'Eucalipto',
    nombreCientifico: 'Eucalyptus globulus',
    tipo: 'flora',
    descripcion: 'Introducido, muy comun.',
    endemica: false,
    habitat: 'Parque de la Villa',
  },
];

// Corre apenas la app levanta. No toca nada si la base ya tiene datos.
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Habitat)
    private readonly habitats: Repository<Habitat>,
    @InjectRepository(Especie)
    private readonly especies: Repository<Especie>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const total = await this.habitats.count();

    if (total > 0) {
      this.logger.log(`La base ya tiene ${total} habitats. No se carga nada.`);
      return;
    }

    this.logger.log('Cargando datos de ejemplo...');

    // save() con un array inserta todo de una y devuelve las entidades ya
    // guardadas, con los id que les asigno la base.
    const habitats = await this.habitats.save(
      HABITATS.map((h) => this.habitats.create(h)),
    );

    // Despues de guardar, cada habitat ya tiene id. Armamos un indice por
    // nombre para no tener que buscar el id a mano en cada especie.
    const idPorNombre = new Map(habitats.map((h) => [h.nombre, h.id]));

    await this.especies.save(
      ESPECIES.map((e) =>
        this.especies.create({
          nombre: e.nombre,
          nombreCientifico: e.nombreCientifico,
          tipo: e.tipo,
          descripcion: e.descripcion,
          endemica: e.endemica,
          habitatId: idPorNombre.get(e.habitat) as number,
        }),
      ),
    );

    this.logger.log(
      `Listo: ${habitats.length} habitats y ${ESPECIES.length} especies.`,
    );
  }
}
