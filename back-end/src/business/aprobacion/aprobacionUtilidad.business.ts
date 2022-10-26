import { getConnection } from 'typeorm';
import { AprobacionUtilidad } from '../../db/model/aprobacion';

export class AprobacionUtilidadBussiness {

    getAllAprobacionUtilidad() {
        return new Promise<AprobacionUtilidad[]>(async (resolve, reject) => {
            const connection = getConnection();
            connection.manager.find(AprobacionUtilidad).then(async (aprobaciones: AprobacionUtilidad[]) => {
                resolve(aprobaciones);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    getAprobacionUtilidadByUsuario(idUsuario: number) {
        return new Promise<AprobacionUtilidad[]>(async (resolve, reject) => {
            const connection = getConnection();
            connection.manager.find(AprobacionUtilidad, { idUsuario }).then(async (aprobaciones: AprobacionUtilidad[]) => {
                resolve(aprobaciones);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    getAprobacionUtilidadByDireccion(idDireccionFlotillas: string) {
        return new Promise<AprobacionUtilidad[]>(async (resolve, reject) => {
            const connection = getConnection();
            connection.manager.find(AprobacionUtilidad, { idDireccionFlotillas }).then(async (aprobaciones: AprobacionUtilidad[]) => {
                resolve(aprobaciones);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    insertAprobacionUtilidadDireccion(data: AprobacionUtilidad[]) {
        return new Promise<AprobacionUtilidad[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const aprobacionUnidadDireccionRepository = await manager.getRepository(AprobacionUtilidad);
                await aprobacionUnidadDireccionRepository.save(data).then(
                    async (res) => {
                        resolve(res);
                    },
                    (error) => { reject(error); },
                );
            });
        });
    }

    removeAprobacionUtilidadDireccion(idDireccionFlotillas: string, idUsuario: number) {
        return new Promise<any>(async (resolve, rejects) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const aprobacionUnidadDireccionRepository = await manager.getRepository(AprobacionUtilidad);
                await aprobacionUnidadDireccionRepository.delete({ idDireccionFlotillas, idUsuario }).then(
                    (res) => {
                        resolve(res);
                    }, (error) => {
                        rejects(error);
                    },
                );
            });
        });
    }

    updateAprobacionUtilidadDireccion(idDireccion, idUsuario, margenUtilidad, idUsuarioModificacion) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const aprobacionUnidadDireccionRepository = await connection.getRepository(AprobacionUtilidad);
            await aprobacionUnidadDireccionRepository.update({ idDireccionFlotillas: idDireccion },
                { idUsuario, margenUtilidad, idUsuarioModificacion, fechaModificacion: new Date() });
            resolve(1);

        });
    }
}
