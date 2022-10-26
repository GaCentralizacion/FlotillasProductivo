import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Sucursal {
    @PrimaryColumn({ name: 'IdSucursal', type: 'int' })
    idSucursal: number;
    @Column({ name: 'Descripcion', type: 'varchar', length: 250, nullable: false })
    nombre: string;
}
