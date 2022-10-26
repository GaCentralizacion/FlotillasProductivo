import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Financiera {
    @PrimaryColumn({ name: 'IdFinanciera', type: 'int' })
    idFinanciera: number;
    @Column({ name: 'Financiera', type: 'varchar', length: 250, nullable: false })
    nombre: string;
}
