import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EspeciesService } from './especies.service';
import { CreateEspecieDto, FiltrosEspeciesDto, UpdateEspecieDto } from './dto';

@Controller('especies')
export class EspeciesController {
  constructor(private readonly especiesService: EspeciesService) {}

  // GET /especies?nombre=om&tipo=fauna&habitatId=1&endemica=true&page=1&limit=10
  @Get()
  findAll(@Query() filtros: FiltrosEspeciesDto) {
    return this.especiesService.findAll(filtros);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.especiesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateEspecieDto) {
    return this.especiesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEspecieDto) {
    return this.especiesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.especiesService.remove(id);
  }
}
