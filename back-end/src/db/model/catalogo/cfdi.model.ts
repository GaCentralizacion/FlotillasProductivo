import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'Cfdi' })
export class Cfdi {
    @PrimaryColumn({ type: 'char', length: 3 })
    idCfdi: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    nombre: string;
    @Column({ type: 'int' })
    estatus: number;
}
