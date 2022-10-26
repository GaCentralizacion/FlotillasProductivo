import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'RelClienteDireccionFlotillas' })
export class RelClienteDireccionFlotillas {
    @PrimaryColumn()
    idCliente: number;
    @PrimaryColumn({ type: 'char', length: 2 })
    idDireccionFlotillas: string;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
}
