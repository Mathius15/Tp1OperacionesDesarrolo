import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

// DTO = Data Transfer Object. Es la "forma" que se espera en el body.
// class-validator + ValidationPipe se encarga de chequear solo, en una linea.
export class CreateHabitatDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, {
    message: 'El nombre es obligatorio y debe tener al menos 3 letras',
  })
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}

// Para PATCH todos los campos son opcionales.
export class UpdateHabitatDto extends CreateHabitatDto {}
