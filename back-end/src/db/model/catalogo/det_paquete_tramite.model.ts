import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EncPaqueteTramite } from './enc_paquete_tramite.model';

@Entity({ name: 'DetPaqueteTramite' })
export class DetPaqueteTramite {
    @PrimaryColumn({ type: 'int' })
    idEncPaqueteTramite: number;
    @PrimaryColumn({ type: 'varchar', length: 20 })
    idTramite: string;
    @PrimaryColumn({ type: 'varchar', length: 20 })
    idSubtramite: string;
    @PrimaryColumn({ type: 'int' })
    idProveedor: number;
    @Column({ type: 'varchar', length: 100, nullable: false })
    nombreTramite: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    nombreSubtramite: string;
    @Column({ type: 'varchar', length: 450, nullable: false })
    nombreProveedor: string;
    @Column({ type: 'money', nullable: false })
    costo: number;
    @Column({ type: 'money', nullable: false })
    precio: number;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @ManyToOne((type) => EncPaqueteTramite, (encabezado) => encabezado.tramites)
    @JoinColumn({ name: 'idEncPaqueteTramite' })
    encabezado: EncPaqueteTramite;
}
