import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'CotizacionDetalleUnidadMov' })
export class CotizacionDetalleUnidadMov {
    @PrimaryGeneratedColumn({name: 'id', type: 'int'})
    id: number;
    @Column({ name: 'idCotizacion', type: 'varchar', length: 20, nullable: false })
    idCotizacion: string;
    @Column({ name: 'idGrupoUnidad', type: 'int', nullable: false })
    idGrupoUnidad: number;
    @Column({ name: 'idDetalleUnidad', type: 'int', nullable: false })
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
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @Column({ name: 'procesadoBpro', type: 'int', nullable: false, default: 0 })
    procesadoBpro: number;
    @Column({ name: 'tipoMovimiento', type: 'varchar', length: 10, nullable: false, default: '' })
    tipoMovimiento: string;
}
