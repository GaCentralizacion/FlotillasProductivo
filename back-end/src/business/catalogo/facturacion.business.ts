import { getConnection } from 'typeorm';
import { Cfdi } from '../../db/model/catalogo';
import { BitacoraBusiness } from '../bitacora/bitacora.business';
export class FacturacionBussiness {
    getAllCfdis(): Promise<Cfdi[]> {
        const bitacoraHandler = new BitacoraBusiness(); // bitacora instaciado
        return new Promise<Cfdi[]>((resolve, reject) => {
            const connection = getConnection();
            const estatus = 1;
            connection.manager.find(Cfdi, {estatus}).then(async (cfdi: Cfdi[]) => {
                // find<Entity>(entityClass: string, conditions?: FindConditions<Entity>): Promise<Entity[]>;
                resolve(cfdi);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }
}
