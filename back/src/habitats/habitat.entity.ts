import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Especie } from '../especies/especie.entity';

// Cada fila de la tabla "habitats" es una fila de esta clase.
// TypeORM usa estos decoradores para crear la tabla si no existe.
@Entity('habitats')
export class Habitat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  // Lado inverso de la relación: un habitat tiene muchas especies.
  // onDelete: CASCADE esta en el lado de la especie (ver Especie.habitat).
  @OneToMany(() => Especie, (especie) => especie.habitat)
  especies: Especie[];
}
