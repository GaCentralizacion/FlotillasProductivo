import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { CotizacionDetalleUnidad } from '.';

@Entity({ name: 'CotizacionUnidadTramiteMov' })
export class CotizacionUnidadTramiteMov {
    @PrimaryGeneratedColumn({name: 'id', type: 'int'})
    id: number;
    @Column({ name: 'idCotizacion', type: 'varchar', length: 20 })
    idCotizacion: string;
    @Column({ name: 'idGrupoUnidad', type: 'int' })
    idGrupoUnidad: number;
    @Column({ name: 'idDetalleUnidad', type: 'int' })
    idDetalleUnidad: number;
    @Column({ type: 'int', nullable: true })
    idEncPaqueteTramite: number;
    @Column({ type: 'varchar', length: 20 })
    idTramite: string;
    @Column({ type: 'varchar', length: 20 })
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
    @Column({ name: 'tipoMovimiento', type: 'char', length: 1, nullable: false })
    tipoMovimiento: string;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @Column({ name: 'estatusBPRO', type: 'int', nullable: true, default: 0 })
    estatusBPRO: number;

    @ManyToOne((type) => CotizacionDetalleUnidad, (detalleUnidad) => detalleUnidad.tramitesMov)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }])
    unidad: CotizacionDetalleUnidad;

}
