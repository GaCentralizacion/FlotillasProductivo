import { getConnection } from 'typeorm';

export class SyncBusiness {
    syncClientes() {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection('sync');
            await connection.query('exec sp_flotillas_merge_client').then((resultadoDB: any[]) => {
                resolve(resultadoDB[0].numeroRegistros);
            }).catch((error) => {
                reject(error);
            });
        });

    }
}
