import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Licitacion {
    @PrimaryColumn({ name: 'IdLicitacion', type: 'varchar', length: 15 })
    idLicitacion: string;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
}
