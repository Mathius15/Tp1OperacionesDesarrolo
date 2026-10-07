import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Habitat } from '../habitats/habitat.entity';

export type TipoEspecie = 'flora' | 'fauna';

@Entity('especies')
export class Especie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  nombreCientifico: string | null;

  @Column({ type: 'text', default: 'flora' })
  tipo: TipoEspecie;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ default: false })
  endemica: boolean;

  // Clave forense: guarda el id del habitat. La base lo valida por nosotros.
  @Column()
  habitatId: number;

  // Lado dueño de la relación. onDelete CASCADE: si se borra el habitat,
  // PostgreSQL borra tambien sus especies.
  @ManyToOne(() => Habitat, (habitat) => habitat.especies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'habitatId' })
  habitat: Habitat;
}
