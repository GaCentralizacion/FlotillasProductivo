import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Accesorio {
    @PrimaryColumn({ type: 'varchar', length: 27 })
    idParte: string;
    @Column({ type: 'varchar', length: 200, nullable: false })
    nombre: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    idAccesorioNuevo: string;
    @Column({ type: 'varchar', length: 200 })
    modeloAnio: string;
    @Column({ type: 'decimal' })
    costo: number;
    @Column({ type: 'decimal' })
    precio: number;
    @Column({ type: 'int' })
    existencia: number;
    @Column({ type: 'varchar', length: 2, nullable: true })
    Planta: string;
    @Column({ type: 'varchar', length: 5, nullable: true })
    Origen: string;
}
