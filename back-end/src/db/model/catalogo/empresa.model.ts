import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Empresa {
    @PrimaryColumn({ name: 'IdEmpresa', type: 'int' })
    idEmpresa: number;
    @Column({ name: 'Descripcion', type: 'varchar', length: 500, nullable: false })
    nombre: string;
}
