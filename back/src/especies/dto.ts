import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const TIPOS = ['flora', 'fauna'] as const;

export class CreateEspecieDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'El nombre es obligatorio y debe tener al menos 3 letras',
  })
  nombre: string;

  @IsString()
  @IsOptional()
  nombreCientifico?: string;

  @IsIn(TIPOS, { message: 'El tipo debe ser "flora" o "fauna"' })
  tipo: (typeof TIPOS)[number];

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  endemica?: boolean;

  // El body viene como JSON, asi que los numeros llegan como texto.
  // Type(...) los convierte a number antes de validar.
  @Type(() => Number)
  @IsInt({ message: 'Falta o es invalido el habitatId' })
  habitatId: number;
}

export class UpdateEspecieDto extends CreateEspecieDto {}

// Los filtros llegan por query string, o sea, siempre texto.
export class FiltrosEspeciesDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsIn(TIPOS, { message: 'El tipo debe ser "flora" o "fauna"' })
  @IsOptional()
  tipo?: (typeof TIPOS)[number];

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  habitatId?: number;

  // "true" / "false" llegan como texto. Transform los pasa a booleano real.
  @Transform(({ value }: { value: unknown }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  endemica?: boolean;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  limit?: number = 10;
}
