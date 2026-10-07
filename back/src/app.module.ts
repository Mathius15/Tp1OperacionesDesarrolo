import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitatsModule } from './habitats/habitats.module';
import { EspeciesModule } from './especies/especies.module';
import { DatabaseModule } from './database/database.module';

// AppModule = el modulo raiz. Acu se conecta todo: la base y los modulos de
// cada parte de la app. Todo lo que este aca adentro queda disponible en
// toda la aplicacion.
@Module({
  imports: [
    // Lee el archivo .env y lo hace accesible con ConfigService.
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexion a PostgreSQL. Los datos salen del .env, con valores por
    // defecto por si el archivo no esta.
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<string>('DB_PORT', '5432')),
        // Ojo: TypeORM le dice "username" al usuario, no "user".
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'tandildb'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // En desarrollo crea/actualiza las tablas solo, a partir de las
        // entidades. OJO: en produccion esto se desactiva y lo que manda son
        // las migraciones (ver README).
        synchronize: config.get<string>('DB_SYNC', 'true') === 'true',
        logging: false,
      }),
    }),

    HabitatsModule,
    EspeciesModule,
    DatabaseModule,
  ],
})
export class AppModule {}
