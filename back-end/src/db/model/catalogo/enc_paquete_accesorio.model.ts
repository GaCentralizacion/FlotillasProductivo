import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { DetPaqueteAccesorio } from './det_paquete_accesorio.model';

@Entity({ name: 'EncPaqueteAccesorio' })
export class EncPaqueteAccesorio {
    @PrimaryColumn({ type: 'int' })
    idEncPaqueteAccesorio: number;
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
    @OneToMany((type) => DetPaqueteAccesorio, (detalle) => detalle.encabezado)
    @JoinColumn({ name: 'idEncPaqueteAccesorio' })
    accesorios: DetPaqueteAccesorio[];
}
