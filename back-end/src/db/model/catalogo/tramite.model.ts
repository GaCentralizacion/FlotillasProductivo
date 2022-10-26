import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Tramite {
    @PrimaryColumn({ name: 'IdTramite', type: 'varchar', length: 20 })
    idTramite: number;
    @Column({ name: 'Descripcion', type: 'varchar', length: 100, nullable: false })
    nombre: string;
}
