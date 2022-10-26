import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CotizacionDetalleUnidad } from '.';

@Entity({ name: 'CotizacionUnidadTramite' })
export class CotizacionUnidadTramite {
    @PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20 })
    idCotizacion: string;
    @PrimaryColumn({ name: 'idGrupoUnidad', type: 'int' })
    idGrupoUnidad: number;
    @PrimaryColumn({ name: 'idDetalleUnidad', type: 'int' })
    idDetalleUnidad: number;
    @Column({ type: 'int', nullable: true })
    idEncPaqueteTramite: number;
    @PrimaryColumn({ type: 'varchar', length: 20 })
    idTramite: string;
    @PrimaryColumn({ type: 'varchar', length: 20 })
    idSubtramite: string;
    @Column({ type: 'int' })
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
    @Column({ type: 'int', nullable: false })
    procesado: number;
    @Column({ name: 'cancelado', type: 'bit', nullable: true })
    cancelado: boolean;

    @ManyToOne((type) => CotizacionDetalleUnidad, (detalleUnidad) => detalleUnidad.tramites)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }])
    unidad: CotizacionDetalleUnidad;

}
