import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { DetPaqueteTramite } from './det_paquete_tramite.model';

@Entity({ name: 'EncPaqueteTramite' })
export class EncPaqueteTramite {
    @PrimaryColumn({ type: 'int' })
    idEncPaqueteTramite: number;
    @Column({ type: 'varchar', length: 100, nullable: false })
    nombre: string;
    @Column({ type: 'varchar', length: 200 })
    descripcion: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    idMarca: string;
    @Column({ type: 'int', nullable: false })
    idEmpresa: string;
    @Column({ type: 'int', nullable: false })
    idSucursal: number;
    @Column({ type: 'varchar', length: 500, nullable: false })
    nombreEmpresa: string;
    @Column({ type: 'varchar', length: 250, nullable: false })
    nombreSucursal: number;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @OneToMany((type) => DetPaqueteTramite, (detalle) => detalle.encabezado)
    @JoinColumn({ name: 'idEncPaqueteTramite' })
    tramites: DetPaqueteTramite[];
}
