import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CotizacionGrupoPaqueteTramite } from '.';

@Entity({ name: 'CotizacionGrupoTramite' })
export class CotizacionGrupoTramite {
    @PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20 })
    idCotizacion: string;
    @PrimaryColumn({ name: 'idGrupoUnidad', type: 'int' })
    idGrupoUnidad: number;
    @Column({ type: 'int', nullable: true })
    idEncPaqueteTramite: number;
    @PrimaryColumn({ type: 'varchar', length: 20 })
    idTramite: string;
    @PrimaryColumn({ type: 'varchar', length: 20 })
    idSubtramite: string;
    @Column({ type: 'int' })
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

    @ManyToOne((type) => CotizacionGrupoPaqueteTramite, (grupoPaqueteTramite) => grupoPaqueteTramite.tramites)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idEncPaqueteTramite', referencedColumnName: 'idEncPaqueteTramite' }])
    grupoPaqueteTramite: CotizacionGrupoPaqueteTramite;
}
