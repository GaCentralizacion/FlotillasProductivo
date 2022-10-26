import { Exception } from 'ts-httpexceptions';
import { Equal, getConnection } from 'typeorm';
import { DetPaqueteTramite, EncPaqueteTramite, ProveedorAdicional, Subtramite, Tramite } from '../../db/model/catalogo';

export class TramiteBusiness {
    getTramites(idMarca: string, idSucursal: number): Promise<Tramite[]> {
        return new Promise<Tramite[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_bpro_tramites @Marca='${idMarca}', @Sucursal=${idSucursal}`).then((resultadosTramite: any[]) => {
                const tramites: Tramite[] = [];
                resultadosTramite.map((resultado) => {
                    tramites.push({ idTramite: resultado.IdTramite, nombre: resultado.Descripcion });
                });
                resolve(tramites);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    getSubtramites(idMarca: string, idSucursal: number, idTramite: string): Promise<Subtramite[]> {
        return new Promise<Subtramite[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_bpro_subtramites @Marca='${idMarca}', @Sucursal=${idSucursal}, @IdTramite='${idTramite}'`).then((resultadosSubtramite: any[]) => {
                const subtramites: Subtramite[] = [];
                resultadosSubtramite.map((resultado) => {
                    subtramites.push({ idSubtramite: resultado.IdSubTramite, nombre: resultado.Descripcion });
                });
                resolve(subtramites);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    getProveedoresSubtramite(idMarca: string, idSucursal: number, idSubtramite: number): Promise<ProveedorAdicional[]> {
        return new Promise<ProveedorAdicional[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_bpro_subtramitesprov @Marca='${idMarca}', @Sucursal=${idSucursal}, @IdSubtramite='${idSubtramite}'`).then((resultadosProveedorAdicional: any[]) => {
                const proveedoresAdicional: ProveedorAdicional[] = [];
                resultadosProveedorAdicional.map((resultado) => {
                    proveedoresAdicional.push({ idProveedor: resultado.IdProveedor, nombreCompleto: resultado.Proveedor.trim(), precio: resultado.Precio, costo: resultado.Costo });
                });
                resolve(proveedoresAdicional);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }
    getPaquetesTramite(idSucursal: number): Promise<EncPaqueteTramite[]> {
        return new Promise<EncPaqueteTramite[]>(async (resolve, reject) => {
            const connection = getConnection();
            const encabezadoRepository = connection.getRepository(EncPaqueteTramite);
            const encabezados = await encabezadoRepository
                .find({
                    where: { idSucursal },
                    relations: ['tramites'],
                });
            resolve(encabezados);
        });
    }
    savePaqueteTramite(encPaqueteTramite: EncPaqueteTramite): Promise<EncPaqueteTramite> {
        return new Promise<EncPaqueteTramite>(async (resolve, reject) => {
            if (encPaqueteTramite.tramites == undefined || encPaqueteTramite.tramites.length == 0) {
                reject(new Exception(409, 'Debe especificar los items que componen el paquete en la propiedad \'tramites\''));
                return;
            }
            const connection = getConnection();
            await connection.transaction('SERIALIZABLE', async (manager) => {
                const encabezadoRepository = await manager.getRepository(EncPaqueteTramite);
                const detalleRepository = await manager.getRepository(DetPaqueteTramite);
                if (encPaqueteTramite.idEncPaqueteTramite == undefined) {
                    const existeEncabezado = await encabezadoRepository
                        .findOne({
                            where: { nombre: encPaqueteTramite.nombre, descripcion: encPaqueteTramite.descripcion },
                        });
                    if (existeEncabezado != undefined) {
                        reject(new Exception(409, 'Ya existe un paquete con este nombre y descripción'));
                        return;
                    }
                }
                if (encPaqueteTramite.idEncPaqueteTramite != undefined) {
                    detalleRepository.delete({ idEncPaqueteTramite: encPaqueteTramite.idEncPaqueteTramite });
                } else {
                    let maxId = (await encabezadoRepository.createQueryBuilder().select('MAX(EncPaqueteTramite.idEncPaqueteTramite)', 'max').getRawOne() as { max: number }).max;
                    maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                    encPaqueteTramite.idEncPaqueteTramite = maxId;
                }
                encPaqueteTramite.tramites.map((detItem) => {
                    detItem.idEncPaqueteTramite = encPaqueteTramite.idEncPaqueteTramite;
                });
                encPaqueteTramite.fechaModificacion = new Date();
                await encabezadoRepository.save(encPaqueteTramite).then(async (encSaved: EncPaqueteTramite) => {
                    for (const detItem of encPaqueteTramite.tramites) {
                        await detalleRepository.save(detItem);
                    }
                    resolve(encSaved);
                }, reject);

            });
        });
    }
    deletePaqueteTramite(idEncPaqueteTramite: number): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const encabezadoRepository = connection.getRepository(EncPaqueteTramite);
            encabezadoRepository.delete({ idEncPaqueteTramite }).then((deleteResult) => {
                resolve(deleteResult.affected);
            }, reject);
        });
    }
}
