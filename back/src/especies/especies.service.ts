import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Especie } from './especie.entity';
import { CreateEspecieDto, FiltrosEspeciesDto, UpdateEspecieDto } from './dto';
import { Habitat } from '../habitats/habitat.entity';

const LIMIT_MAXIMO = 50;

@Injectable()
export class EspeciesService {
  constructor(
    @InjectRepository(Especie)
    private readonly especies: Repository<Especie>,
    @InjectRepository(Habitat)
    private readonly habitats: Repository<Habitat>,
  ) {}

  async findAll(filtros: FiltrosEspeciesDto): Promise<Especie[]> {
    const page = filtros.page ?? 1;
    const limit = Math.min(filtros.limit ?? 10, LIMIT_MAXIMO);

    // QueryBuilder: arma el SELECT paso a paso. Cada .andWhere() suma una
    // condicion con AND. Los valores van aparte (parametros $1, $2...), nunca
    // pegados dentro del texto, asi que no hay inyeccion SQL.
    const qb = this.especies
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.habitat', 'h')
      .orderBy('e.nombre', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    if (filtros.nombre) {
      qb.andWhere('e.nombre ILIKE :nombre', { nombre: `%${filtros.nombre}%` });
    }

    if (filtros.tipo) {
      qb.andWhere('e.tipo = :tipo', { tipo: filtros.tipo });
    }

    if (filtros.habitatId) {
      qb.andWhere('e.habitatId = :habitatId', { habitatId: filtros.habitatId });
    }

    if (filtros.endemica !== undefined) {
      qb.andWhere('e.endemica = :endemica', { endemica: filtros.endemica });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Especie> {
    const especie = await this.especies.findOne({
      where: { id },
      relations: { habitat: true },
    });

    if (!especie) {
      throw new NotFoundException('Especie no encontrada');
    }

    return especie;
  }

  async create(dto: CreateEspecieDto): Promise<Especie> {
    await this.verificarHabitat(dto.habitatId);

    const especie = this.especies.create({
      nombre: dto.nombre.trim(),
      nombreCientifico: dto.nombreCientifico?.trim() || null,
      tipo: dto.tipo,
      descripcion: dto.descripcion?.trim() || null,
      endemica: dto.endemica ?? false,
      habitatId: dto.habitatId,
    });

    return this.especies.save(especie);
  }

  async update(id: number, dto: UpdateEspecieDto): Promise<Especie> {
    await this.findOne(id);
    await this.verificarHabitat(dto.habitatId);

    await this.especies.update(
      { id },
      {
        nombre: dto.nombre.trim(),
        nombreCientifico: dto.nombreCientifico?.trim() || null,
        tipo: dto.tipo,
        descripcion: dto.descripcion?.trim() || null,
        endemica: dto.endemica ?? false,
        habitatId: dto.habitatId,
      },
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<Especie> {
    const especie = await this.findOne(id);
    await this.especies.delete({ id });

    return especie;
  }

  private async verificarHabitat(habitatId: number): Promise<void> {
    const existe = await this.habitats.exists({ where: { id: habitatId } });

    if (!existe) {
      throw new NotFoundException('El habitat indicado no existe');
    }
  }
}
