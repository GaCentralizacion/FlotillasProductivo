import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UnidadBpro {
    @PrimaryColumn({ name: 'IdCatalogo', type: 'varchar', length: 20 })
    idUnidadBpro: string;
    @Column({ name: 'Carline', type: 'varchar', length: 100, nullable: false })
    linea: string;
}
