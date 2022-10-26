import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'AccesorioNuevo' })
export class AccesorioNuevo {
    @PrimaryColumn({ type: 'int' })
    idAccesorioNuevo: number;
    @Column({ type: 'varchar', length: 200, nullable: false })
    nombre: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    idMarca: string;
    @Column({ type: 'int', nullable: false })
    idEmpresa: number;
    @Column({ type: 'int', nullable: false })
    idSucursal: number;
    @Column({ type: 'varchar', length: 100, nullable: false })
    idTipoProveedor: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    idProveedor: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    idDireccionFlotillas: string;
    @Column({ type: 'varchar', length: 500, nullable: false })
    nombreEmpresa: string;
    @Column({ type: 'varchar', length: 250, nullable: false })
    nombreSucursal: string;
    @Column({ type: 'varchar', length: 450, nullable: false })
    nombreProveedor: string;
    @Column({ type: 'varchar', length: 200 })
    modeloAnio: string;
    @Column({ type: 'money', nullable: false })
    costo: number;
    @Column({ type: 'money', nullable: false })
    precio: number;
    @Column({ type: 'int', nullable: false })
    idUsuario: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
}
