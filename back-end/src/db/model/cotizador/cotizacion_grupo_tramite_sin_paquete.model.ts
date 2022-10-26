import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CotizacionGrupoUnidad } from '.';

@Entity({ name: 'CotizacionGrupoTramiteSinPaquete' })
export class CotizacionGrupoTramiteSinPaquete {
    @PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20 })
    idCotizacion: string;
    @PrimaryColumn({ name: 'idGrupoUnidad', type: 'int' })
    idGrupoUnidad: number;
    @PrimaryColumn({ type: 'varchar', length: 20 })
    idTramite: string;
    @PrimaryColumn({ type: 'varchar', length: 20 })
    idSubtramite: string;
    @PrimaryColumn({ type: 'int' })
    idProveedor: number;
    @Column({ type: 'varchar', length: 100, nullable: false })
    nombreTramite: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    nombreSubtramite: string;
    @Column({ type: 'varchar', length: 450, nullable: false })
    nombreProveedor: string;
    @Column({ type: 'money', nullable: false })
    costo: number;
    @Column({ type: 'money', nullable: false })
    precio: number;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;

    @ManyToOne((type) => CotizacionGrupoUnidad, (grupoUnidad) => grupoUnidad.paquetesTramites)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }])
    grupoUnidad: CotizacionGrupoUnidad;
}
