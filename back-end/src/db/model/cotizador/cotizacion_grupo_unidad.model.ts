import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import {
    Cotizacion, CotizacionDetalleUnidad, CotizacionGrupoPaqueteAccesorio, CotizacionGrupoPaqueteTramite,
    CotizacionGrupoServicioUnidadSinPaquete,
    CotizacionGrupoTramiteSinPaquete,
} from '.';
import { UnidadInteres } from '../catalogo';
import { CotizacionGrupoAccesorioSinPaquete } from './cotizacion_grupo_accesorio_sin_paquete.model';
import { CotizacionGrupoPaqueteServicioUnidad } from './cotizacion_grupo_paquete_servicio_unidad.model';
import { CotizacionTraslado } from './cotizacion_traslado.model';

@Entity({ name: 'CotizacionGrupoUnidad' })
export class CotizacionGrupoUnidad {
    @PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20 })
    idCotizacion: string;
    @PrimaryColumn({ name: 'idGrupoUnidad', type: 'int' })
    idGrupoUnidad: number;
    @Column({ name: 'catalogo', type: 'varchar', length: 40, nullable: false })
    catalogo: number;
    @Column({ name: 'anio', type: 'varchar', length: 4, nullable: false })
    anio: string;
    @Column({ name: 'clase', type: 'varchar', length: 100, nullable: false })
    clase: string;
    @Column({ name: 'modelo', type: 'varchar', length: 50, nullable: false })
    modelo: string;
    @Column({ name: 'versionUnidad', type: 'varchar', length: 500, nullable: false })
    versionUnidad: string;
    @Column({ name: 'idColorInterior', type: 'varchar', length: 100, nullable: false })
    idColorInterior: string;
    @Column({ name: 'colorInterior', type: 'varchar', length: 100, nullable: false })
    colorInterior: string;
    @Column({ name: 'idColorExterior', type: 'varchar', length: 100, nullable: false })
    idColorExterior: string;
    @Column({ name: 'colorExterior', type: 'varchar', length: 100, nullable: false })
    colorExterior: string;
    @Column({ name: 'cantidad', type: 'int', nullable: false })
    cantidad: number;
    @Column({ name: 'costo', type: 'money', nullable: false })
    costo: number;
    @Column({ name: 'precio', type: 'money', nullable: false })
    precio: number;
    @Column({ name: 'idCondicion', type: 'varchar', length: 2, enum: ['C0', 'C1'] })
    idCondicion: string;
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
    @Column({ name: 'tipoOrden', type: 'varchar', length: 2, enum: ['FI', 'CU'] })
    tipoOrden: string;
    @Column({ name: 'leyendaFactura', type: 'text' })
    leyendaFactura: string;
    @Column({ type: 'datetime' })
    fechaHoraPromesaEntrega: Date;
    @Column({ name: 'costoTotal', type: 'money' })
    costoTotal: number;
    @Column({ name: 'precioTotal', type: 'money' })
    precioTotal: number;
    @Column({ name: 'utilidadBruta', type: 'money' })
    utilidadBruta: number;
    @Column({ name: 'porcentajeUtilidad', type: 'decimal' })
    porcentajeUtilidad: number;
    @Column({ name: 'precioTotalTotal', type: 'decimal' })
    precioTotalTotal: number;
    @Column({ name: 'ivaTotal', type: 'money' })
    ivaTotal: number;
    @Column({ name: 'tipoCargoUnidad', type: 'varchar', length: 50, default: 'Suma' })
    tipoCargoUnidad: string;
    @Column({ name: 'bonificacion', type: 'money' })
    bonificacion: number;
    @Column({ name: 'idBonificacion', type: 'varchar', length: 50 })
    idBonificacion: string;
    @Column({ name: 'imprimeFactura', type: 'bit', default: false })
    imprimeFactura: boolean;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @ManyToOne((type) => Cotizacion, (cotizacion) => cotizacion.gruposUnidades)
    @JoinColumn({ name: 'idCotizacion' })
    cotizacion: Cotizacion;

    @OneToMany((type) => CotizacionDetalleUnidad, (detalleUnidad) => detalleUnidad.grupoUnidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }])
    detalleUnidades: CotizacionDetalleUnidad[];

    @OneToMany((type) => UnidadInteres, (unidadesInteres) => unidadesInteres.grupoUnidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }])
    unidadesInteres: UnidadInteres[];

    @OneToMany((type) => CotizacionGrupoPaqueteAccesorio, (grupoPaqueteAccesorio) => grupoPaqueteAccesorio.grupoUnidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }])
    paquetesAccesorios: CotizacionGrupoPaqueteAccesorio[];

    @OneToMany((type) => CotizacionGrupoAccesorioSinPaquete, (grupoAccesorioSinPaquete) => grupoAccesorioSinPaquete.grupoUnidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }])
    accesoriosSinPaquete: CotizacionGrupoAccesorioSinPaquete[];

    @OneToMany((type) => CotizacionGrupoPaqueteTramite, (grupoPaqueteTramite) => grupoPaqueteTramite.grupoUnidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }])
    paquetesTramites: CotizacionGrupoPaqueteTramite[];

    @OneToMany((type) => CotizacionGrupoTramiteSinPaquete, (grupoTramiteSinPaquete) => grupoTramiteSinPaquete.grupoUnidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }])
    tramitesSinPaquete: CotizacionGrupoTramiteSinPaquete[];

    @OneToMany((type) => CotizacionGrupoPaqueteServicioUnidad, (grupoPaqueteServicioUnidad) => grupoPaqueteServicioUnidad.grupoUnidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }])
    paquetesServicioUnidad: CotizacionGrupoPaqueteServicioUnidad[];

    @OneToMany((type) => CotizacionGrupoServicioUnidadSinPaquete, (grupoServicioUnidadSinPaquete) => grupoServicioUnidadSinPaquete.grupoUnidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }])
    serviciosUnidadSinPaquete: CotizacionGrupoServicioUnidadSinPaquete[];

    @OneToMany((type) => CotizacionTraslado, (cotizacionTraslado) => cotizacionTraslado.grupoUnidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }])
    traslados: CotizacionTraslado[];

}
