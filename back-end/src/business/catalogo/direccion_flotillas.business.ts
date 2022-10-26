import { getConnection } from 'typeorm';
import { DireccionFlotillas } from '../../db/model/catalogo';
import { BitacoraBusiness } from '../bitacora/bitacora.business';

export class DireccionFlotillasBusiness {
    getAllDireccionFlotillas(): Promise<DireccionFlotillas[]> {
        const bitacoraHandler = new BitacoraBusiness(); // bitacora instaciado
        return new Promise<DireccionFlotillas[]>((resolve, reject) => {
            const connection = getConnection();
            connection.manager.find(DireccionFlotillas).then(async (direccionesFlotillas: DireccionFlotillas[]) => {
                // bitacoraHandler.saveRegister(3, DireccionFlotillas.name, 'select', 'CATALOGOS', direccionesFlotillas); // guardado en bitacora
                resolve(direccionesFlotillas);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }
}
