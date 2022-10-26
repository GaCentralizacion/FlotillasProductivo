import { Exception } from 'ts-httpexceptions';
import { getConnection } from 'typeorm';
import { DetPaqueteServicioUnidad, EncPaqueteServicioUnidad, ServicioUnidad } from '../../db/model/catalogo';

export class ServicioUnidadBusiness {
    getServiciosUnidad(idSucursal: number, catalogo: string, anio: string): Promise<ServicioUnidad[]> {
        return new Promise<ServicioUnidad[]>(async (resolve, reject) => {
            const connection = getConnection();
            const filtroText = ``;
            await connection.query(`exec sp_bpro_paqueser @Sucursal=${idSucursal}, @TipoBD = '1', @IdCatalogo = '${catalogo}', @Modelo = '${anio}'`)
                .then((resultadoAccesorios: any[]) => {
                    const serviciosUnidad: ServicioUnidad[] = [];
                    resultadoAccesorios.map((resultado) => {
                        serviciosUnidad.push({
                            idServicioUnidad: resultado.IdPAquete.trim(),
                            nombre: resultado.NomPaquete,
                            descripcion: resultado.Descripcion,
                            costo: resultado.Costo,
                            precio: resultado.Precio,
                        });
                    });
                    resolve(serviciosUnidad);
                },
                    async (error) => {
                        reject(error);
                    },
                );
        });
    }
    getPaquetesServicioUnidad(idSucursal: number, catalogo: string = null, anio: string = null): Promise<EncPaqueteServicioUnidad[]> {
        return new Promise<EncPaqueteServicioUnidad[]>(async (resolve, reject) => {
            const connection = getConnection();
            const encabezadoRepository = connection.getRepository(EncPaqueteServicioUnidad);
            const condicion = { idSucursal };
            if (catalogo != undefined) {
                condicion['catalogo'] = catalogo;
            }
            if (anio != undefined) {
                condicion['anio'] = anio;
            }
            const encabezados = await encabezadoRepository
                .find({
                    relations: ['serviciosUnidad'], where: condicion,
                });
            resolve(encabezados);
        });
    }
    savePaqueteServicioUnidad(encPaqueteServicioUnidad: EncPaqueteServicioUnidad): Promise<EncPaqueteServicioUnidad> {
        return new Promise<EncPaqueteServicioUnidad>(async (resolve, reject) => {
            if (encPaqueteServicioUnidad.serviciosUnidad == undefined || encPaqueteServicioUnidad.serviciosUnidad.length == 0) {
                reject(new Exception(409, 'Debe especificar los items que componen el paquete en la propiedad \'serviciosUnidad\''));
            }
            const connection = getConnection();
            await connection.transaction('SERIALIZABLE', async (manager) => {
                const encabezadoRepository = await manager.getRepository(EncPaqueteServicioUnidad);
                const detalleRepository = await manager.getRepository(DetPaqueteServicioUnidad);
                if (encPaqueteServicioUnidad.idEncPaqueteServicioUnidad != undefined) {
                    detalleRepository.delete({ idEncPaqueteServicioUnidad: encPaqueteServicioUnidad.idEncPaqueteServicioUnidad });
                } else {
                    let maxId = (await encabezadoRepository.createQueryBuilder().select('MAX(EncPaqueteServicioUnidad.idEncPaqueteServicioUnidad)', 'max').getRawOne() as { max: number }).max;
                    maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                    encPaqueteServicioUnidad.idEncPaqueteServicioUnidad = maxId;
                }
                encPaqueteServicioUnidad.serviciosUnidad.map((detItem) => {
                    detItem.idEncPaqueteServicioUnidad = encPaqueteServicioUnidad.idEncPaqueteServicioUnidad;
                });
                encPaqueteServicioUnidad.fechaModificacion = new Date();
                await encabezadoRepository.save(encPaqueteServicioUnidad).then(async (encSaved: EncPaqueteServicioUnidad) => {
                    for (const detItem of encPaqueteServicioUnidad.serviciosUnidad) {
                        detItem.catalogo = encSaved.catalogo;
                        detItem.anio = encSaved.anio;
                        await detalleRepository.save(detItem);
                    }
                    resolve(encSaved);
                }, reject);

            });
        });
    }
    deletePaqueteServicioUnidad(idEncPaqueteServicioUnidad: number): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const encabezadoRepository = connection.getRepository(EncPaqueteServicioUnidad);
            encabezadoRepository.delete({ idEncPaqueteServicioUnidad }).then((deleteResult) => {
                resolve(deleteResult.affected);
            }, reject);
        });
    }
}
