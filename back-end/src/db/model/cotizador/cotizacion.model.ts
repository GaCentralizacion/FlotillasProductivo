import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { CotizacionDetalleUnidad } from '.';
import { CotizacionGrupoUnidad } from '.';

@Entity({ name: 'Cotizacion' })
export class Cotizacion {
    @PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20 })
    idCotizacion: string;
    @Column({ name: 'idDireccionFlotillas', type: 'varchar', length: 2, nullable: false })
    idDireccionFlotillas: string;
    @Column({ name: 'idCliente', type: 'int', nullable: false })
    idCliente: number;
    @Column({ name: 'idClienteContacto', type: 'int', nullable: false })
    idClienteContacto: number;
    @Column({ name: 'nombreCliente', type: 'varchar', length: 20, nullable: false })
    nombreCliente: string;
    @Column({ name: 'idCondicion', type: 'varchar', length: 2, nullable: false })
    idCondicion: string;
    @Column({ name: 'nombreCondicion', type: 'varchar', length: 20, nullable: false })
    nombreCondicion: string;
    @Column({ name: 'idEmpresa', type: 'int', nullable: false })
    idEmpresa: number;
    @Column({ name: 'nombreEmpresa', type: 'varchar', length: 50, nullable: false })
    nombreEmpresa: string;
    @Column({ name: 'idMarca', type: 'varchar', length: 100, nullable: false })
    idMarca: string;
    @Column({ name: 'idSucursal', type: 'int', nullable: false })
    idSucursal: number;
    @Column({ name: 'nombreSucursal', type: 'varchar', length: 100, nullable: false })
    nombreSucursal: string;
    @Column({ name: 'idUsuario', type: 'int', nullable: false })
    idUsuario: number;
    @Column({ name: 'unidades', type: 'int', nullable: true })
    unidades: number;
    @Column({ name: 'idLicitacion', type: 'varchar', length: 15, nullable: false })
    idLicitacion: string;
    @Column({ name: 'idFinanciera', type: 'int', nullable: false })
    idFinanciera: number;
    @Column({ name: 'nombreFinanciera', type: 'varchar', length: 50, nullable: false })
    nombreFinanciera: string;
    @Column({ name: 'nombreTipoVenta', type: 'varchar', length: 50, nullable: true })
    nombreTipoVenta: string;
    @Column({ name: 'nombreMoneda', type: 'varchar', length: 50, nullable: true })
    nombreMoneda: string;
    @Column({ name: 'nombreIva', type: 'varchar', length: 50, nullable: true })
    nombreIva: string;
    @Column({ name: 'nombreContacto', type: 'varchar', length: 50, nullable: true })
    nombreContacto: string;
    @Column({ name: 'idCfdi', type: 'varchar', length: 10 })
    idCfdi: string;
    @Column({ name: 'idCfdiAdicionales', type: 'varchar', length: 10 })
    idCfdiAdicionales: string;
    @Column({ name: 'tipoOrden', type: 'varchar', length: 2, enum: ['FI', 'CU'] })
    tipoOrden: string;
    @Column({ name: 'status', type: 'varchar', length: 50, nullable: false })
    status: string;
    @Column({ name: 'step', type: 'int', nullable: false })
    step: number;
    @Column({ name: 'costoTotal', type: 'money' })
    costoTotal: number;
    @Column({ name: 'precioTotal', type: 'money' })
    precioTotal: number;
    @Column({ name: 'utilidadBruta', type: 'money' })
    utilidadBruta: number;
    @Column({ name: 'numeroOrden', type: 'varchar', length: 50 })
    numeroOrden: string;
    @Column({ name: 'idTipoVenta', type: 'varchar', length: 20 })
    idTipoVenta: string;
    @Column({ name: 'idMonedaVenta', type: 'varchar', length: 20 })
    idMonedaVenta: string;
    @Column({ name: 'idIva', type: 'varchar', length: 20 })
    idIva: string;
    @Column({ name: 'tasaIva', type: 'decimal' })
    tasaIva: number;
    @Column({ name: 'ivaTotal', type: 'decimal' })
    ivaTotal: number;
    @Column({ name: 'porcentajeUtilidad', type: 'decimal' })
    porcentajeUtilidad: number;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @Column({ name: 'procesadoBpro', type: 'int', nullable: false, default: 0 })
    procesadoBpro: number;
    @Column({ name: 'tipoCargoUnidad', type: 'varchar', length: 50, default: 'Suma' })
    tipoCargoUnidad: string;
    @Column({ name: 'clienteOriginal', type: 'varchar', length: 50 })
    clienteOriginal: string;
    @Column({ name: 'notificacion', type: 'bit', nullable: true })
    notificacion: boolean;
    @Column({ name: 'imprimeFactura', type: 'bit', default: false })
    imprimeFactura: boolean;
    @Column({ name: 'idClienteFacturaAdicionales', type: 'int', nullable: true })
    idClienteFacturaAdicionales: number; // Facturacion Adicionales
    @Column({ name: 'numeroOCAdicionales', type: 'varchar', length: 50 })
    numeroOCAdicionales: string; // Facturacion Adicionales
    @OneToMany((type) => CotizacionGrupoUnidad, (gruposUnidades) => gruposUnidades.cotizacion)
    @JoinColumn({ name: 'idCotizacion' })
    gruposUnidades: CotizacionGrupoUnidad[];
}
