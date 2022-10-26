import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { CotizacionDetalleUnidad } from '.';

@Entity({ name: 'CotizacionUnidadAccesorioMov' })
export class CotizacionUnidadAccesorioMov {
    @PrimaryGeneratedColumn({name: 'id', type: 'int'})
    id: number;
    @Column({ name: 'idCotizacion', type: 'varchar', length: 20, nullable: false })
    idCotizacion: string;
    @Column({ name: 'idGrupoUnidad', type: 'int', nullable: false })
    idGrupoUnidad: number;
    @Column({ name: 'idDetalleUnidad', type: 'int' })
    idDetalleUnidad: number;
    @Column({ name: 'idEncPaqueteAccesorio', type: 'int', nullable: true })
    idEncPaqueteAccesorio: number;
    @Column({ name: 'idDetPaqueteAccesorio', type: 'int', nullable: true })
    idDetPaqueteAccesorio: number;
    @Column({ name: 'idAccesorioNuevo', type: 'int' })
    idAccesorioNuevo: number;
    @Column({ name: 'nombre', type: 'varchar', length: 200, nullable: false })
    nombre: string;
    @Column({ name: 'idTipoProveedor', type: 'varchar', length: 100, nullable: true })
    idTipoProveedor: string;
    @Column({ name: 'idProveedor', type: 'int', nullable: true })
    idProveedor: number;
    @Column({ name: 'nombreProveedor', type: 'varchar', length: 450, nullable: true })
    nombreProveedor: string;
    @Column({ name: 'idParte', type: 'varchar', length: 27 })
    idParte = '';
    @Column({ name: 'modeloAnio', type: 'varchar', length: 200, nullable: true })
    modeloAnio: string;
    @Column({ name: 'cantidad', type: 'decimal', nullable: false })
    cantidad: number;
    @Column({ name: 'costo', type: 'money', nullable: false })
    costo: number;
    @Column({ name: 'precio', type: 'money', nullable: false })
    precio: number;
    @Column({ name: 'tipoMovimiento', type: 'char', length: 1, nullable: false })
    tipoMovimiento: string;
    @Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ name: 'fechaModificacion', type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @Column({ name: 'estatusBPRO', type: 'int', nullable: true, default: 0 })
    estatusBPRO: number;

    @ManyToOne((type) => CotizacionDetalleUnidad, (unidad) => unidad.accesorios)
    @JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }])
    unidad: CotizacionDetalleUnidad;

}
