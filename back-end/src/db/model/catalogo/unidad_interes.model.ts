import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Cotizacion, CotizacionGrupoUnidad } from '../cotizador';

@Entity({ name: 'UnidadInteres' })
export class UnidadInteres {
    @PrimaryColumn({ type: 'int' })
    idInventario: number;
    @PrimaryColumn({ type: 'varchar', length: 20, nullable: false })
    idCotizacion: string;
    @Column({ type: 'int', nullable: false })
    idGrupoUnidad: number;
    @Column({ type: 'char', length: 2, nullable: false })
    idDireccionFlotillas: string;
    @Column({ type: 'varchar', length: 50, nullable: false })
    tipoUnidad: string;
    @Column({ type: 'varchar', length: 4, nullable: false })
    anio: string;
    @Column({ type: 'varchar', length: 50, nullable: false })
    modelo: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    idColorInterior: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    colorInterior: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    idColorExterior: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    colorExterior: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    clase: string;
    @Column({ type: 'varchar', length: 40, nullable: false })
    catalogo: string;
    @Column({ type: 'money', nullable: false })
    precio: number;
    @Column({ type: 'money', nullable: false })
    costo: number;
    @Column({ type: 'varchar', length: 50, nullable: false })
    marca: string;
    @Column({ type: 'int', nullable: false })
    antiguedad: number;
    @Column({ type: 'varchar', length: 100, nullable: false })
    segmento: string;
    @Column({ type: 'varchar', length: 500, nullable: false })
    descripcion: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    agencia: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    clasificacionTipoCompra: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    vin: string;
    @Column({ type: 'int', nullable: false })
    idEmpresa: number;
    @Column({ type: 'int', nullable: false })
    idSucursal: number;
    @Column({ type: 'varchar', length: 50, nullable: false })
    bd: string;
    @Column({ type: 'varchar', length: 50, nullable: false })
    tipoBase: string;
    @Column({ type: 'int', nullable: false })
    idEstatusUnidadInteres: number;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @ManyToOne((type) => CotizacionGrupoUnidad, (grupoUnidad) => grupoUnidad.unidadesInteres)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }])
    grupoUnidad: CotizacionGrupoUnidad;
}
