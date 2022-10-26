import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CotizacionTraslado } from './cotizacion_traslado.model';

@Entity({ name: 'CotizacionUnidadTrasladoMov' })
export class CotizacionUnidadTrasladoMov {
    @PrimaryGeneratedColumn({ name: 'idCotizacionTrasladoMov', type: 'int' })
    idCotizacionTrasladoMov: number;
    @Column({ name: 'idCotizacion', type: 'varchar', length: 20 })
    idCotizacion: string;
    @Column({ name: 'idGrupoUnidad', type: 'int' })
    idGrupoUnidad: number;
    @Column({ name: 'idTraslado', type: 'int' })
    idTraslado: number;
    @Column({ name: 'idCotizacionTraslado', type: 'int' })
    idCotizacionTraslado: number;
    @Column({ type: 'int', nullable: false })
    usuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @Column({ type: 'varchar', length: 1, nullable: true })
    tipoMovimiento: string;

    // @ManyToOne((type) => CotizacionTraslado, (cotizacionTraslado) => cotizacionTraslado)
    // @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idCotizacionTraslado', referencedColumnName: 'idCotizacionTraslado' }])
    // cotizacionUnidadTraslado: CotizacionTraslado;

}
