import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { CotizacionGrupoTramite, CotizacionGrupoUnidad } from '.';

@Entity({ name: 'CotizacionGrupoPaqueteTramite' })
export class CotizacionGrupoPaqueteTramite {
    @PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20, nullable: false })
    idCotizacion: string;
    @PrimaryColumn({ name: 'idGrupoUnidad', type: 'int', nullable: false })
    idGrupoUnidad: number;
    @PrimaryColumn({ type: 'int' })
    idEncPaqueteTramite: number;
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
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;

    @ManyToOne((type) => CotizacionGrupoUnidad, (grupoUnidad) => grupoUnidad.paquetesTramites)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }])
    grupoUnidad: CotizacionGrupoUnidad;

    @OneToMany((type) => CotizacionGrupoTramite, (cotizacionGrupoTramite) => cotizacionGrupoTramite.grupoPaqueteTramite)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idEncPaqueteTramite', referencedColumnName: 'idEncPaqueteTramite' }])
    tramites: CotizacionGrupoTramite[];
}
