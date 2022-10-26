import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ProveedorAdicional {
    @PrimaryColumn()
    idProveedor: number;
    @Column({ type: 'varchar', length: 450 })
    nombreCompleto: string;
    @Column({ type: 'decimal' })
    costo: number;
    @Column({ type: 'decimal' })
    precio: number;
}
