import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { HabitatsService } from './habitats.service';
import { CreateHabitatDto, UpdateHabitatDto } from './dto';

// El controller solo traduce HTTP <-> service. No tiene reglas de negocio.
@Controller('habitats')
export class HabitatsController {
  constructor(private readonly habitatsService: HabitatsService) {}

  @Get()
  findAll() {
    return this.habitatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.habitatsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateHabitatDto) {
    return this.habitatsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHabitatDto) {
    return this.habitatsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.habitatsService.remove(id);
  }
}
