import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habitat } from './habitat.entity';
import { HabitatsController } from './habitats.controller';
import { HabitatsService } from './habitats.service';
import { Especie } from '../especies/especie.entity';

@Module({
  // TypeOrmModule.forFeature le "presta" los repositorios a este modulo.
  // Los repositorios son como una tabla con metodos CRUD ya hechos.
  imports: [TypeOrmModule.forFeature([Habitat, Especie])],
  controllers: [HabitatsController],
  providers: [HabitatsService],
  // Los servicios que exporta este modulo se pueden importar en otros.
  exports: [HabitatsService],
})
export class HabitatsModule {}
