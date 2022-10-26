import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CotizacionGrupoPaqueteAccesorio } from '.';

@Entity({ name: 'CotizacionGrupoAccesorio' })
export class CotizacionGrupoAccesorio {
    @PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20, nullable: false })
    idCotizacion: string;

    @PrimaryColumn({ name: 'idGrupoUnidad', type: 'int', nullable: false })
    idGrupoUnidad: number;

    @Column({ name: 'idEncPaqueteAccesorio', type: 'int', nullable: true })
    idEncPaqueteAccesorio: number;

    @Column({ name: 'idDetPaqueteAccesorio', type: 'int', nullable: true })
    idDetPaqueteAccesorio: number;

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

    @Column({ name: 'idAlmacen', type: 'varchar', length: 3, nullable: true }) // SISCO
    idAlmacen: string;

    @Column({ name: 'Planta', type: 'varchar', length: 10, nullable: true }) // SISCO
    Planta: string;

    @ManyToOne((type) => CotizacionGrupoPaqueteAccesorio, (grupoPaqueteAccesorio) => grupoPaqueteAccesorio.accesorios)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idEncPaqueteAccesorio', referencedColumnName: 'idEncPaqueteAccesorio' }])
    grupoPaqueteAccesorio: CotizacionGrupoPaqueteAccesorio;

}
