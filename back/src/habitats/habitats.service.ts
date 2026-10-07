import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habitat } from './habitat.entity';
import { CreateHabitatDto, UpdateHabitatDto } from './dto';
import { Especie } from '../especies/especie.entity';

// El service es el que habla con la base. Los controllers no tocan la base:
// solo traducen HTTP. Asi la logica se puede testear sin levantar el server.
@Injectable()
export class HabitatsService {
  constructor(
    @InjectRepository(Habitat)
    private readonly habitats: Repository<Habitat>,
    @InjectRepository(Especie)
    private readonly especies: Repository<Especie>,
  ) {}

  async findAll(): Promise<Array<Habitat & { cantidadEspecies: number }>> {
    const habitats = await this.habitats.find({
      relations: { especies: true },
      order: { nombre: 'ASC' },
    });

    // El contador no es una columna: lo calculamos y lo agregamos al resultado.
    return habitats.map((habitat) => ({
      ...habitat,
      cantidadEspecies: habitat.especies.length,
    }));
  }

  async findOne(id: number): Promise<Habitat> {
    const habitat = await this.habitats.findOne({ where: { id } });

    if (!habitat) {
      // NotFoundException se convierte solo en un 404 con el mensaje.
      throw new NotFoundException('Habitat no encontrado');
    }

    return habitat;
  }

  async create(dto: CreateHabitatDto): Promise<Habitat> {
    const habitat = this.habitats.create({
      nombre: dto.nombre.trim(),
      descripcion: dto.descripcion?.trim() || null,
    });

    return this.habitats.save(habitat);
  }

  async update(id: number, dto: UpdateHabitatDto): Promise<Habitat> {
    // findOne tira 404 si no existe, asi que no hace falta chequear aca.
    await this.findOne(id);

    await this.habitats.update(
      { id },
      {
        nombre: dto.nombre.trim(),
        descripcion: dto.descripcion?.trim() || null,
      },
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<Habitat> {
    const habitat = await this.findOne(id);

    const total = await this.especies.count({ where: { habitatId: id } });

    if (total > 0) {
      // 409 = Conflicto. El recurso existe pero no se puede tocar en este estado.
      throw new ConflictException(
        'No se puede borrar: el habitat tiene especies asociadas. Borralas primero.',
      );
    }

    // Ya tenemos el habitat en memoria (findOne lo tiro si no existia).
    await this.habitats.delete({ id });

    return habitat;
  }
}
