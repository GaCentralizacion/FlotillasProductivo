import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UnidadMedida {
    @PrimaryColumn({ name: 'Id', type: 'varchar', length: 200 })
    idUnidadMedida: number;
    @Column({ name: 'Descripcion', type: 'varchar', length: 500, nullable: false })
    nombre: string;
}
