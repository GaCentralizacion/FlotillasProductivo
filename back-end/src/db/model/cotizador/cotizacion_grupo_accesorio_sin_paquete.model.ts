import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CotizacionGrupoUnidad } from '.';

@Entity({ name: 'CotizacionGrupoAccesorioSinPaquete' })
export class CotizacionGrupoAccesorioSinPaquete {
    @PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20 })
    idCotizacion: string;
    @PrimaryColumn({ name: 'idGrupoUnidad', type: 'int' })
    idGrupoUnidad: number;
    @PrimaryColumn({ name: 'idAccesorioNuevo', type: 'int' })
    idAccesorioNuevo: number;
    @Column({ name: 'nombre', type: 'varchar', length: 200, nullable: false })
    nombre: string;
    @Column({ name: 'idTipoProveedor', type: 'varchar', length: 100, nullable: true })
    idTipoProveedor: string;
    @Column({ name: 'idProveedor', type: 'int', nullable: true })
    idProveedor: number;
    @Column({ name: 'nombreProveedor', type: 'varchar', length: 450, nullable: true })
    nombreProveedor: string;
    @PrimaryColumn({ name: 'idParte', type: 'varchar', length: 27 })
    idParte = '';
    @Column({ name: 'modeloAnio', type: 'varchar', length: 200, nullable: true })
    modeloAnio: string;
    @Column({ name: 'cantidad', type: 'decimal', nullable: false })
    cantidad: number;
    @Column({ name: 'costo', type: 'money', nullable: false })
    costo: number;
    @Column({ name: 'precio', type: 'money', nullable: false })
    precio: number;
    @Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ name: 'fechaModificacion', type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @Column({ name: 'enCompras', type: 'int', nullable: true }) // SISCO
    enCompras: number;
    @Column({ name: 'observaciones', type: 'varchar', length: 250, nullable: true })
    observaciones: string; // SISCO
    @Column({ name: 'estatusSolicitud', type: 'int', nullable: true }) // SISCO
    estatusSolicitud: number;
    @Column({ name: 'idAlmacen', type: 'varchar', length: 2, nullable: true }) // SISCO
    idAlmacen: string;
    @Column({ name: 'Planta', type: 'varchar', length: 10, nullable: true }) // SISCO
    Planta: string;
    @Column({ name: 'existencia', type: 'int', nullable: true }) // SISCO
    existencia: number;
    @Column({ name: 'nEstatus', type: 'varchar'}) // SISCO
    nEstatus: string;
    @ManyToOne((type) => CotizacionGrupoUnidad, (grupoUnidad) => grupoUnidad.paquetesAccesorios)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }])
    grupoUnidad: CotizacionGrupoUnidad;
}
