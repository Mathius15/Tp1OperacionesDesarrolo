import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especie } from './especie.entity';
import { EspeciesController } from './especies.controller';
import { EspeciesService } from './especies.service';
import { Habitat } from '../habitats/habitat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Especie, Habitat])],
  controllers: [EspeciesController],
  providers: [EspeciesService],
  exports: [EspeciesService],
})
export class EspeciesModule {}
