import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'cot_ordencomprefaccionesdet' })
export class CotOrdencomprefaccionesdet {
    @PrimaryColumn({name: 'ocrd_idordencomprefacciones', type: 'int'})
    ocrd_idordencomprefacciones: number;
    @Column({ name: 'ocrd_idparte', type: 'varchar', length: 50, nullable: false })
    ocrd_idparte: string;
    @Column({ name: 'ocrd_desparte', type: 'varchar', length: 250, nullable: false })
    ocrd_desparte: number;
    @Column({ name: 'ocrd_cantidad', type: 'int', nullable: false })
    ocrd_cantidad: number;
    @Column({ name: 'ocrd_costo', type: 'int', nullable: false })
    ocrd_costo: string;
    @Column({ name: 'ocr_idordencomprefacciones', type: 'int', nullable: false })
    ocr_idordencomprefacciones: number;
    @Column({ name: 'ocrd_idparteflo', type: 'varchar', length: 50, nullable: false })
    ocrd_idparteflo: string;
    @Column({ name: 'ocrd_estatus', type: 'int', nullable: false })
    ocrd_estatus: number;
    @Column({ name: 'ocrd_fechasol', type: 'date' })
    ocrd_fechasol: Date;
    @Column({ name: 'ocrd_fechafin', type: 'date' })
    ocrd_fechafin: Date;
}
