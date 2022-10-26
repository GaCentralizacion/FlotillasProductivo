import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class InventarioUnidad {
    @PrimaryColumn({ name: 'IdInventario', type: 'int' })
    idInventario: number;
    @Column({ name: 'TipoUnidad', type: 'varchar', length: 50, nullable: false })
    tipoUnidad: string;
    @Column({ name: 'Año', type: 'varchar', length: 4, nullable: false })
    anio: string;
    @Column({ name: 'Modelo', type: 'varchar', length: 50, nullable: false })
    modelo: string;
    @Column({ name: 'ColorInteriorC', type: 'varchar', length: 100, nullable: false })
    idColorInterior: string;
    @Column({ name: 'ColorInterior', type: 'varchar', length: 100, nullable: false })
    colorInterior: string;
    @Column({ name: 'ColorExteriorC', type: 'varchar', length: 100, nullable: false })
    idColorExterior: string;
    @Column({ name: 'ColorExterior', type: 'varchar', length: 100, nullable: false })
    colorExterior: string;
    @Column({ name: 'Clase', type: 'varchar', length: 100, nullable: false })
    clase: string;
    @Column({ name: 'Catalogo', type: 'varchar', length: 40, nullable: false })
    catalogo: string;
    @Column({ name: 'PrecioUnidad', type: 'decimal', nullable: false })
    precio: number;
    @Column({ name: 'CostoUnidad', type: 'decimal', nullable: false })
    costo: number;
    @Column({ name: 'CantidadInventario', type: 'int', nullable: false })
    cantidad: number;
    @Column({ name: 'Marca', type: 'varchar', length: 50, nullable: false })
    marca: string;
    @Column({ name: 'Antiguedad', type: 'int', nullable: false })
    antiguedad: number;
    @Column({ name: 'Segmento', type: 'varchar', length: 100, nullable: false })
    segmento: string;
    @Column({ name: 'Descripcion', type: 'varchar', length: 500, nullable: false })
    descripcion: string;
    @Column({ name: 'Agencia', type: 'varchar', length: 100, nullable: false })
    agencia: string;
    @Column({ name: 'ClasifTipoCompra', type: 'varchar', length: 100, nullable: false })
    clasificacionTipoCompra: string;
    @Column({ name: 'VIN', type: 'varchar', length: 100, nullable: false })
    vin: string;
    @Column({ name: 'IdEmpresa', type: 'int', nullable: false })
    idEmpresa: number;
    @Column({ name: 'IdSucursal', type: 'int', nullable: false })
    idSucursal: number;
    @Column({ name: 'Bd', type: 'varchar', length: 50, nullable: false })
    bd: string;
    @Column({ name: 'TipoBase', type: 'varchar', length: 50, nullable: false })
    tipoBase: string;
    @Column({ name: 'IdCottizacionGlobal', type: 'varchar', length: 50, nullable: false })
    idCotizacion: string;
    @Column({ name: 'Situacion', type: 'varchar', length: 50, nullable: false })
    estatusUnidad: string;
}
