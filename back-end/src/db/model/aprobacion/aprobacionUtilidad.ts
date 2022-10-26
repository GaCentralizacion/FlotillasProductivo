import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'AprobacionUtilidad', database: 'FlotillasBism' })
export class AprobacionUtilidad {

    @PrimaryColumn({ name: 'idDireccionFlotillas', type: 'varchar', length: 2, nullable: false })
    idDireccionFlotillas: string;
    @PrimaryColumn({ name: 'idUsuario', type: 'int' })
    idUsuario: number;
    @Column({ name: 'margenUtilidad', type: 'int', nullable: false })
    margenUtilidad: string;
    @Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ name: 'fechaModificacion', type: 'datetime', nullable: false })
    fechaModificacion: Date;
}
