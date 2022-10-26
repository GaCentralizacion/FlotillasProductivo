import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'DireccionFlotillas' })
export class DireccionFlotillas {
    @PrimaryColumn({ type: 'varchar', length: 2 })
    idDireccionFlotillas: string;
    @Column({ type: 'varchar', length: 30, nullable: false })
    nombre: string;
}
