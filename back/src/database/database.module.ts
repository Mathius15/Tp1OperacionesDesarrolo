import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Habitat } from '../habitats/habitat.entity';
import { Especie } from '../especies/especie.entity';

// Modulo auxiliar: aca vive la carga de datos de ejemplo.
// Si en el TP esto crece (por ejemplo, para meter migraciones reales),
// este es el lugar natural.
@Module({
  imports: [TypeOrmModule.forFeature([Habitat, Especie])],
  providers: [SeedService],
})
export class DatabaseModule {}
