import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Subtramite {
    @PrimaryColumn({ name: 'IdSubTramite', type: 'varchar', length: 20 })
    idSubtramite: number;
    @Column({ name: 'Descripcion', type: 'varchar', length: 100, nullable: false })
    nombre: string;
}
