import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { CotizacionGrupoUnidad, CotizacionUnidadAccesorio, CotizacionUnidadAccesorioMov, CotizacionUnidadServicioUnidad, CotizacionUnidadServicioUnidadMov, CotizacionUnidadTramiteMov } from '.';
import { CotizacionUnidadTramite } from './cotizacion_unidad_tramite.model';

@Entity({ name: 'CotizacionDetalleUnidad' })
export class CotizacionDetalleUnidad {
    @PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20, nullable: false })
    idCotizacion: string;
    @PrimaryColumn({ name: 'idGrupoUnidad', type: 'int', nullable: false })
    idGrupoUnidad: number;
    @PrimaryColumn({ name: 'idDetalleUnidad', type: 'int', nullable: false })
    idDetalleUnidad: number;
    @Column({ name: 'idCondicion', type: 'varchar', length: 2, enum: ['C0', 'C1'] })
    idCondicion: string;
    @Column({ name: 'vin', type: 'varchar', length: 100 })
    vin: string;
    @Column({ name: 'idIva', type: 'varchar', length: 20 })
    idIva: string;
    @Column({ name: 'tasaIva', type: 'decimal' })
    tasaIva: number;
    @Column({ name: 'idFinanciera', type: 'int' })
    idFinanciera: number;
    @Column({ name: 'nombreFinanciera', type: 'varchar', length: 250 })
    nombreFinanciera: string;
    @Column({ name: 'colorInteriorFacturacion', type: 'varchar', length: 100 })
    colorInteriorFacturacion: string;
    @Column({ name: 'colorExteriorFacturacion', type: 'varchar', length: 100 })
    colorExteriorFacturacion: string;
    @Column({ name: 'idCfdi', type: 'varchar', length: 10 })
    idCfdi: string;
    @Column({ name: 'idCfdiAdicionales', type: 'varchar', length: 10 })
    idCfdiAdicionales: string;
    @Column({ name: 'tipoOrden', type: 'varchar', length: 2, enum: ['FI', 'CU'], default: null })
    tipoOrden: string;
    @Column({ name: 'leyendaFactura', type: 'text' })
    leyendaFactura: string;
    @Column({ name: 'fechaHoraPromesaEntrega', type: 'datetime' })
    fechaHoraPromesaEntrega: Date;
    @Column({ name: 'costoTotal', type: 'money' })
    costoTotal: number;
    @Column({ name: 'precioTotal', type: 'money' })
    precioTotal: number;
    @Column({ name: 'utilidadBruta', type: 'money' })
    utilidadBruta: number;
    @Column({ name: 'ivaTotal', type: 'money' })
    ivaTotal: number;
    @Column({ name: 'porcentajeUtilidad', type: 'decimal' })
    porcentajeUtilidad: number;
    @Column({ name: 'tipoCargoUnidad', type: 'varchar', length: 50, default: 'Suma' })
    tipoCargoUnidad: string;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ name: 'imprimeFactura', type: 'bit', default: false })
    imprimeFactura: boolean;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @Column({ name: 'procesadoBpro', type: 'int', nullable: false, default: 0 })
    procesadoBpro: number;
    @Column({ name: 'tipoMovimiento', type: 'varchar', length: 10, nullable: false, default: '' })
    tipoMovimiento: string;

    // Se agrega para recuperar el status de brpro por unidad de cotizacion universal unidades
    @Column({ name: 'estatus', type: 'varchar', length: 20, nullable: true, default: '' })
    estatus: string;

    @ManyToOne((type) => CotizacionGrupoUnidad, (encabezado) => encabezado.detalleUnidades)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, {name: 'estatus', referencedColumnName: 'idGrupoUnidad'}])
    grupoUnidad: CotizacionGrupoUnidad;

    @OneToMany((type) => CotizacionUnidadAccesorio, (accesorio) => accesorio.unidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }])
    accesorios: CotizacionUnidadAccesorio[];

    @OneToMany((type) => CotizacionUnidadAccesorioMov, (accesorioMov) => accesorioMov.unidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }])
    accesoriosMov: CotizacionUnidadAccesorioMov[];

    @OneToMany((type) => CotizacionUnidadTramite, (tramite) => tramite.unidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }])
    tramites: CotizacionUnidadTramite[];

    @OneToMany((type) => CotizacionUnidadTramiteMov, (tramiteMov) => tramiteMov.unidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }])
    tramitesMov: CotizacionUnidadTramiteMov[];

    @OneToMany((type) => CotizacionUnidadServicioUnidad, (servicioUnidad) => servicioUnidad.unidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }])
    serviciosUnidad: CotizacionUnidadServicioUnidad[];

    @OneToMany((type) => CotizacionUnidadServicioUnidadMov, (servicioUnidadMov) => servicioUnidadMov.unidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }])
    serviciosUnidadMov: CotizacionUnidadServicioUnidadMov[];
}
