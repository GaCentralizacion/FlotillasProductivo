import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CotizacionGrupoPaqueteServicioUnidad } from '.';

@Entity({ name: 'CotizacionGrupoServicioUnidad' })
export class CotizacionGrupoServicioUnidad {
    @PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20 })
    idCotizacion: string;
    @PrimaryColumn({ name: 'idGrupoUnidad', type: 'int' })
    idGrupoUnidad: number;
    @Column({ type: 'int', nullable: true })
    idEncPaqueteServicioUnidad: number;
    @PrimaryColumn({ type: 'varchar', length: 200 })
    idServicioUnidad: string;
    @Column({ type: 'varchar', length: 40, nullable: false })
    catalogo: string;
    @Column({ type: 'varchar', length: 4, nullable: false })
    anio: string;
    @Column({ type: 'varchar', length: 500, nullable: false })
    nombre: string;
    @Column({ type: 'varchar', length: 500, nullable: false })
    descripcion: string;
    @Column({ type: 'money', nullable: false })
    costo: number;
    @Column({ type: 'money', nullable: false })
    precio: number;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;

    @ManyToOne((type) => CotizacionGrupoPaqueteServicioUnidad, (grupoPaqueteServicioUnidad) => grupoPaqueteServicioUnidad.serviciosUnidad)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idEncPaqueteServicioUnidad', referencedColumnName: 'idEncPaqueteServicioUnidad' }])
    grupoPaqueteServicioUnidad: CotizacionGrupoPaqueteServicioUnidad;

}
