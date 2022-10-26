import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'RelClienteCfdi' })
export class RelClienteCfdi {
    @PrimaryColumn()
    idCliente: number;
    @Column({ type: 'varchar', length: 3, nullable: false })
    idCfdiUnidades: string;
    @Column({ type: 'varchar', length: 3, nullable: false })
    idCfdiAccesorios: string;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
}
