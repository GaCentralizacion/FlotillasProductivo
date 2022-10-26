import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { CotizacionGrupoServicioUnidad, CotizacionGrupoUnidad } from '.';

@Entity({ name: 'CotizacionGrupoPaqueteServicioUnidad' })
export class CotizacionGrupoPaqueteServicioUnidad {
    @PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20, nullable: false })
    idCotizacion: string;
    @PrimaryColumn({ name: 'idGrupoUnidad', type: 'int', nullable: false })
    idGrupoUnidad: number;
    @PrimaryColumn({ type: 'int' })
    idEncPaqueteServicioUnidad: number;
    @Column({ type: 'varchar', length: 100, nullable: false })
    nombre: string;
    @Column({ type: 'varchar', length: 200 })
    descripcion: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    idMarca: string;
    @Column({ type: 'int', nullable: false })
    idEmpresa: string;
    @Column({ type: 'int', nullable: false })
    idSucursal: number;
    @Column({ type: 'varchar', length: 500, nullable: false })
    nombreEmpresa: string;
    @Column({ type: 'varchar', length: 250, nullable: false })
    nombreSucursal: number;
    @Column({ type: 'varchar', length: 40, nullable: false })
    catalogo: string;
    @Column({ type: 'varchar', length: 4, nullable: false })
    anio: string;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;

    @ManyToOne((type) => CotizacionGrupoUnidad, (grupoUnidad) => grupoUnidad.paquetesServicioUnidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }])
    grupoUnidad: CotizacionGrupoUnidad;

    @OneToMany((type) => CotizacionGrupoServicioUnidad, (cotizacionGrupoServicioUnidad) => cotizacionGrupoServicioUnidad.grupoPaqueteServicioUnidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idEncPaqueteServicioUnidad', referencedColumnName: 'idEncPaqueteServicioUnidad' }])
    serviciosUnidad: CotizacionGrupoServicioUnidad[];
}
