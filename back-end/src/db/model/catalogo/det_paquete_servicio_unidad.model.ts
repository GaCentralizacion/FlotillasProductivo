import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EncPaqueteServicioUnidad } from './enc_paquete_servicio_unidad.model';

@Entity({ name: 'DetPaqueteServicioUnidad' })
export class DetPaqueteServicioUnidad {
    @PrimaryColumn({ type: 'int' })
    idEncPaqueteServicioUnidad: number;
    @PrimaryColumn({ type: 'varchar', length: 200 })
    idServicioUnidad: string;
    @Column({ type: 'varchar', length: 40, nullable: false })
    catalogo: string;
    @Column({ type: 'varchar', length: 4, nullable: false })
    anio: string;
    @Column({ type: 'varchar', length: 500, nullable: false })
    nombre: string;
    @Column({ type: 'varchar', length: 500, nullable: false })
    descripcion: string;
    @Column({ type: 'money', nullable: false })
    costo: number;
    @Column({ type: 'money', nullable: false })
    precio: number;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @ManyToOne((type) => EncPaqueteServicioUnidad, (encabezado) => encabezado.serviciosUnidad)
    @JoinColumn({ name: 'idEncPaqueteServicioUnidad' })
    encabezado: EncPaqueteServicioUnidad;
}
