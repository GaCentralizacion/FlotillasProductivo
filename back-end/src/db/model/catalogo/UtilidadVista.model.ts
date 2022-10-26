import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'UtilidadVista' })
export class UtilidadVista {
    @PrimaryColumn({ name: 'idsecuencia', type: 'int' })
    idsecuencia: number;
    @Column({ name: 'tipoStatus', type: 'varchar', length: 20, nullable: false })
    tipoStatus: string;
    @Column({ name: 'idCotizacion', type: 'varchar', length: 20, nullable: false })
    idCotizacion: string;
    @Column({ name: 'tipoMovimiento', type: 'varchar', length: 150, nullable: false })
    tipoMovimiento: string;
    @Column({ name: 'nombreStep', type: 'varchar', length: 50, nullable: false })
    nombreStep: string;
    @Column({ name: 'idArticulo', type: 'varchar', length: 27, nullable: false })
    idArticulo: string;
    @Column({ name: 'dsArticulo', type: 'varchar', length: 503, nullable: false })
    dsArticulo: string;
    @Column({ name: 'cantidad', type: 'int', nullable: false })
    cantidad: number;
    @Column({ name: 'precioUnitario', type: 'money', nullable: false })
    precioUnitario: number;
    @Column({ name: 'costoUnitario', type: 'money', nullable: false })
    costoUnitario: number;
    @Column({ name: 'precio', type: 'money', nullable: false })
    precio: number;
    @Column({ name: 'costo', type: 'money', nullable: false })
    costo: number;
    @Column({ name: 'utilidadUnitaria', type: 'money', nullable: false })
    utilidadUnitaria: number;
    @Column({ name: 'tipoOrden', type: 'varchar', length: 20, nullable: false })
    tipoOrden: string;
    @Column({ name: 'idCFDI', type: 'varchar', length: 20, nullable: false })
    idCFDI: string;
    @Column({ name: 'idGrupoUnidad', type: 'varchar', length: 20, nullable: false })
    idGrupoUnidad: string;
    @Column({ name: 'utilidadCot', type: 'varchar', length: 20, nullable: false })
    utilidadCot: number;
    @Column({ name: 'utilidadPost', type: 'varchar', length: 20, nullable: false })
    utilidadPost: number;
    @Column({ name: 'utilidadAd', type: 'varchar', length: 20, nullable: false })
    utilidadAd: number;
    @Column({ name: 'totalUtilidad', type: 'varchar', length: 20, nullable: false })
    totalUtilidad: number;
    @Column({ name: 'version', type: 'varchar', length: 20, nullable: false })
    version: string;
}
