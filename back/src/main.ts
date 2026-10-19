import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // El front corre en otro puerto (4200). CORS le permite calling a la API
  // aunque no esten en el mismo origen.
  app.enableCors();

  // ValidationPipe:
  //  - chequea los DTOs con las reglas de class-validator (400 si falla),
  //  - whitelist: true descarta campos que no estan en el DTO,
  //  - transform: true convierte "3" en 3, "true" en true, etc.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  console.log(`API escuchando en http://localhost:${port}`);
}

void bootstrap();
// trigger
