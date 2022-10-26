import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ServicioUnidad {
    @PrimaryColumn({ type: 'varchar', length: 200 })
    idServicioUnidad: string;
    @Column({ type: 'varchar', length: 500, nullable: false })
    nombre: string;
    @Column({ type: 'varchar', length: 500 })
    descripcion: string;
    @Column({ type: 'money' })
    costo: number;
    @Column({ type: 'money' })
    precio: number;
}
