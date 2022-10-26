import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { DetPaqueteServicioUnidad } from './det_paquete_servicio_unidad.model';

@Entity({ name: 'EncPaqueteServicioUnidad' })
export class EncPaqueteServicioUnidad {
    @PrimaryColumn({ type: 'int' })
    idEncPaqueteServicioUnidad: number;
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
    @Column({ type: 'varchar', length: 40, nullable: false })
    catalogo: string;
    @Column({ type: 'varchar', length: 4, nullable: false })
    anio: string;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @OneToMany((type) => DetPaqueteServicioUnidad, (detalle) => detalle.encabezado)
    @JoinColumn({ name: 'idEncPaqueteServicioUnidad' })
    serviciosUnidad: DetPaqueteServicioUnidad[];
}
