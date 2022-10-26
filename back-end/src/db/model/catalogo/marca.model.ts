import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Marca {
    @PrimaryColumn({name: 'Nombre', length: 100, type: 'varchar'})
    idMarca: string;
}
