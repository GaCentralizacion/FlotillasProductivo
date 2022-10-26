import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class EstatusUnidadInteres {
    @PrimaryColumn({ type: 'int' })
    idEstatusUnidadInteres: number;
    @Column({ type: 'varchar', length: 20, nullable: false })
    nombre: string;
}
