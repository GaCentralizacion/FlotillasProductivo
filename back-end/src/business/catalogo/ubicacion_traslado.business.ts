import { getConnection } from 'typeorm';
import { UbicacionTraslado } from '../../db/model/catalogo';

export class UbicacionTrasladoBusiness {

    getUbicacionTraslados() {
        return new Promise<UbicacionTraslado[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.manager.find(UbicacionTraslado).then(
                (ubicacionTraslados: UbicacionTraslado[]) => {
                    resolve(ubicacionTraslados);
                }, (err) => {
                    reject(err);
                },
            );
        });
    }

    saveUbicacionTraslados(data: UbicacionTraslado[]) {
        return new Promise<any>(async (resolve, reject) => {
            for (const ele of data) {
                const connection = getConnection();
                await connection.transaction('SERIALIZABLE', async (manager) => {
                    const ubicacionTrasladosRepository = await manager.getRepository(UbicacionTraslado);
                    if (ele.idUbicacionTraslado !== null && ele.idUbicacionTraslado !== undefined) {
                        const eleToupdate = await ubicacionTrasladosRepository.findOne(ele.idUbicacionTraslado);
                        eleToupdate.idUbicacionTraslado = ele.idUbicacionTraslado;
                        eleToupdate.nombre = ele.nombre;
                        eleToupdate.descripcion = ele.descripcion;
                        eleToupdate.direccion = ele.direccion;
                        await ubicacionTrasladosRepository.delete(ele.idUbicacionTraslado).then(async () => {
                            await ubicacionTrasladosRepository.save(eleToupdate).then((res) => {
                                resolve(res);
                            }, (err) => {
                                reject(err);
                            });
                        }, (err) => {
                            reject(err);
                        });
                    } else {
                        let maxId = (await ubicacionTrasladosRepository.createQueryBuilder().select('MAX(UbicacionTraslado.idUbicacionTraslado)', 'max').getRawOne() as { max: number }).max;
                        maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                        ele.idUbicacionTraslado = maxId;
                        console.log(ele);
                        await ubicacionTrasladosRepository.save(ele).then(
                            (res) => {
                                resolve(res);
                            },
                            (err) => {
                                console.log(err);
                                reject(err);
                            },
                        );
                    }
                });
            }
        });
    }

    removeUbicacionTraslados(idUbicacionTraslado: number) {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const ubicacionTrasladosRepository = await manager.getRepository(UbicacionTraslado);
                await ubicacionTrasladosRepository.delete({ idUbicacionTraslado }).then(
                    (res) => {
                        resolve(res);
                    },
                    (err) => {
                        reject(err);
                    },
                );
            });
        });
    }
}
