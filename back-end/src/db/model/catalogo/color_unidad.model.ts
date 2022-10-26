import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ColorUnidad {
    @PrimaryColumn({ name: 'ColClave', type: 'varchar', length: 10 })
    idColor: string;
    @Column({ name: 'ColDescripcion', type: 'varchar', length: 30, nullable: false })
    nombre: string;
}
