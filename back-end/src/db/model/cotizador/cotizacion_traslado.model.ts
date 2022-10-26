import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { CotizacionGrupoUnidad } from '.';
import { CotizacionUnidadTrasladoMov } from './cotizacion_unidad_traslado_mov.model';

@Entity({ name: 'CotizacionTraslado' })
export class CotizacionTraslado {
    @PrimaryColumn({ name: 'idCotizacionTraslado', type: 'int' })
    idCotizacionTraslado: number;
    @Column({ name: 'idCotizacionTrasladoPadre', type: 'int' })
    idCotizacionTrasladoPadre: number;
    @Column({ name: 'idCotizacion', type: 'varchar', length: 20, nullable: false })
    idCotizacion: string;
    @Column({ name: 'idGrupoUnidad', type: 'int', nullable: false })
    idGrupoUnidad: number;
    @Column({ name: 'idTraslado', type: 'int', nullable: false })
    idTraslado: number;
    @Column({ name: 'cantidad', type: 'int', nullable: false })
    cantidad: number;
    @Column({ name: 'fechaEntrega', type: 'date', nullable: false })
    fechaEntrega: Date;
    @Column({ name: 'costoUnitario', type: 'money', nullable: false })
    costoUnitario: number;
    @Column({ name: 'precioUnitario', type: 'money', nullable: false })
    precioUnitario: number;
    @Column({ name: 'costoTotal', type: 'money', nullable: false })
    costoTotal: number;
    @Column({ name: 'precioTotal', type: 'money', nullable: false })
    precioTotal: number;
    @Column({ name: 'utilidadTotal', type: 'money', nullable: false })
    utilidadTotal: number;
    @Column({ type: 'bit', nullable: false })
    idMedioTransporte: boolean;
    @Column({ type: 'money', nullable: false })
    impuestoTransporte: number;
    @Column({ name: 'idProveedor', type: 'int', nullable: false })
    idProveedor: number;
    @Column({ name: 'nombreProveedor', type: 'varchar', length: 450, nullable: false })
    nombreProveedor: string;
    @Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ name: 'fechaModificacion', type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @Column({ name: 'activo', type: 'bit', nullable: true, default: 1 })
    activo: boolean;
    @Column({ name: 'idCfdi', type: 'varchar', length: 25})
    idCfdi: string;

    @ManyToOne((type) => CotizacionGrupoUnidad, (grupoUnidad) => grupoUnidad.paquetesServicioUnidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }])
    grupoUnidad: CotizacionGrupoUnidad;

    // @OneToMany((type) => CotizacionUnidadTrasladoMov, (cut) => cut.cotizacionUnidadTraslado)
    // @JoinColumn([{ name: 'idCotizacionTraslado', referencedColumnName: 'idCotizacionTraslado' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idCotizacion', referencedColumnName: 'idCotizacion' }])
    // serviciosUnidadMov: CotizacionUnidadTrasladoMov[];

}
