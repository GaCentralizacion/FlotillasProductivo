import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EncPaqueteAccesorio } from './enc_paquete_accesorio.model';

@Entity({ name: 'DetPaqueteAccesorio' })
export class DetPaqueteAccesorio {
    @PrimaryColumn({ type: 'int' })
    idEncPaqueteAccesorio: number;
    @PrimaryColumn({ type: 'int' })
    idDetPaqueteAccesorio: number;
    @Column({ type: 'int' })
    idAccesorioNuevo: number;
    @Column({ type: 'varchar', length: 200, nullable: false })
    nombre: string;
    @Column({ type: 'varchar', length: 100 })
    idTipoProveedor: string;
    @Column({ type: 'int' })
    idProveedor: number;
    @Column({ type: 'varchar', length: 450 })
    nombreProveedor: string;
    @Column({ type: 'varchar', length: 27 })
    idParte: string;
    @Column({ type: 'varchar', length: 200 })
    modeloAnio: string;
    @Column({ type: 'decimal', nullable: false })
    cantidad: number;
    @Column({ type: 'money', nullable: false })
    costo: number;
    @Column({ type: 'money', nullable: false })
    precio: number;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @ManyToOne((type) => EncPaqueteAccesorio, (encabezado) => encabezado.accesorios)
    @JoinColumn({ name: 'idEncPaqueteAccesorio' })
    encabezado: EncPaqueteAccesorio;
}
