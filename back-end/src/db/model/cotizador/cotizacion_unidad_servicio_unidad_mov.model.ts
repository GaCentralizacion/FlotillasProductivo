import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { CotizacionDetalleUnidad } from '.';

@Entity({ name: 'CotizacionUnidadServicioUnidadMov' })
export class CotizacionUnidadServicioUnidadMov {
    @PrimaryGeneratedColumn({name: 'id', type: 'int'})
    id: number;
    @Column({ name: 'idCotizacion', type: 'varchar', length: 20 })
    idCotizacion: string;
    @Column({ name: 'idGrupoUnidad', type: 'int' })
    idGrupoUnidad: number;
    @Column({ name: 'idDetalleUnidad', type: 'int' })
    idDetalleUnidad: number;
    @Column({ type: 'int', nullable: true })
    idEncPaqueteServicioUnidad: number;
    @Column({ type: 'varchar', length: 200 })
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
    @Column({ name: 'tipoMovimiento', type: 'char', length: 1, nullable: false })
    tipoMovimiento: string;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @Column({ name: 'estatusBPRO', type: 'int', nullable: true, default: 0 })
    estatusBPRO: number;

    @ManyToOne((type) => CotizacionDetalleUnidad, (detalleUnidad) => detalleUnidad.serviciosUnidadMov)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }])
    unidad: CotizacionDetalleUnidad;

}
