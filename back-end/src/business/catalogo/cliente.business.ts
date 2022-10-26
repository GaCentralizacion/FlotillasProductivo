import { getConnection, Like } from 'typeorm';
import { Cliente, ClienteFilterResult, RelClienteCfdi, RelClienteDireccionFlotillas } from '../../db/model/catalogo';
import { ClienteFilter } from '../../db/model/catalogo';
import { BitacoraBusiness } from '../bitacora/bitacora.business';

export class ClienteBussiness {

    getCliente(idCliente: number): Promise<Cliente> {
        return new Promise<Cliente>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_ListadoClientes @filtroSelect='idCliente',@nombreCompleto=` + idCliente)
                .then(async (resp: Cliente) => {
                    resolve(resp);
                },
                    async (error) => {
                        reject(error);
                    },
                );
        });
    }
    getClientes(filtroCliente: ClienteFilter): Promise<ClienteFilterResult> {
        return new Promise<ClienteFilterResult>(async (resolve, reject) => {
            let condiciones = ``;
            const condExtra: string[] = [];
            const connection = getConnection();

            if (filtroCliente.filtroSelect !== undefined) {
                condExtra.push(`@filtroSelect= '${filtroCliente.filtroSelect}'`);
            }

            if (filtroCliente.idCliente != undefined) {
                condExtra.push(`@idCliente= '${filtroCliente.idCliente}'`);
            } else {
                if (filtroCliente.nombreCompleto != undefined) {
                    condExtra.push(`@nombreCompleto= '${filtroCliente.nombreCompleto}'`);
                }

                if (filtroCliente.tipoPersona != undefined) {
                    condExtra.push(`@tipoPersona= '${filtroCliente.tipoPersona}'`);
                }
            }

            condiciones = condiciones + (condExtra.length > 0 ? condExtra.join(', ') : '');
            await connection.query(`exec sp_Flotillas_ListadoClientes ${condiciones}`)
            .then((resp: Cliente[]) => {
                const retorno = new ClienteFilterResult();
                retorno.clientes = resp;
                resolve(retorno);

            })
            .catch(reject);
        });
    }

    filtrarClientes(filtro: string, tipoPersona) {
        return new Promise<any>(async (resolve, reject) => {
            let condiciones = ``;
            const condExtra: string[] = [];
            const connection = getConnection();

            if (filtro != undefined) {
                condExtra.push(`@nombreCompleto='${filtro}'`);
            }

            if (tipoPersona != undefined) {
                condExtra.push(`@tipoPersona='${tipoPersona}'`);
            }

            condiciones = condiciones + (condExtra.length > 0 ? condExtra.join(', ') : '');

            await connection.query(`exec sp_Flotillas_ListadoClientes ${condiciones}`)
            .then((resp: Cliente[]) => {
                if (!resp.length) {
                    reject({ status: 400, error: `No se han encontrado resultados con el filtro ${filtro}` });
                }
                resolve(resp);
            })
            .catch(reject);
        });
    }

    getAllRelDireccionFlotillas(): Promise<RelClienteDireccionFlotillas[]> {
        const bitacoraHandler = new BitacoraBusiness(); // bitacora instaciado
        return new Promise<RelClienteDireccionFlotillas[]>((resolve, reject) => {
            const connection = getConnection();
            connection.manager.find(RelClienteDireccionFlotillas).then(async (relsClienteDireccionFlotillas: RelClienteDireccionFlotillas[]) => {

                resolve(relsClienteDireccionFlotillas);

                // bitacoraHandler.saveRegister(3, RelClienteDireccionFlotillas.name, 'select', 'CATALOGOS', relsClienteDireccionFlotillas); // guardado en bitacora
            },
                async (error) => {
                    reject(error);
                },
            );

        });
    }

    saveRelsDireccionFlotillas(relsDireccionFlotillas: Array<{ idCliente: number, direccionesFlotillas: RelClienteDireccionFlotillas[] }>, idUsuario: number) {
        const distinctClients = [...new Set(relsDireccionFlotillas.map((i) => i.idCliente))];
        const bitacoraHandler = new BitacoraBusiness(); // bitacora
        return new Promise<number>((resolve, reject) => {
            const connection = getConnection();
            let hasError = false;
            connection.transaction(async (manager) => {
                for (const idClienteValue of distinctClients) {
                    await manager.delete(RelClienteDireccionFlotillas, { idCliente: idClienteValue }).then(
                        (data) => {
                            bitacoraHandler.saveRegister(idUsuario, RelClienteDireccionFlotillas.name, 'delete', 'CATALOGOS', data); // bitacora
                        }, (error) => {
                            hasError = true;
                            reject(error);
                        },
                    );
                }
                const relRepository = await manager.getRepository(RelClienteDireccionFlotillas);
                for (const relItemCliente of relsDireccionFlotillas) {
                    if (relItemCliente.direccionesFlotillas != undefined) {
                        await relRepository.save(relItemCliente.direccionesFlotillas).then(
                            (data) => {
                                bitacoraHandler.saveRegister(idUsuario, RelClienteDireccionFlotillas.name, 'insert', 'CATALOGOS', data); // bitacora
                            }, (error) => {
                                hasError = true;
                                reject(error);
                            },
                        );
                    }
                }
                resolve(relsDireccionFlotillas.length);
            });
        });
    }

    getAllRelCfdis(idCliente: number = null): Promise<RelClienteCfdi[]> {
        const bitacoraHandler = new BitacoraBusiness(); // bitacora
        return new Promise<RelClienteCfdi[]>((resolve, reject) => {
            const connection = getConnection();
            let condiciones = {};
            if (idCliente != undefined) {
                condiciones = { idCliente };
            }
            connection.manager.find(RelClienteCfdi, condiciones).then(async (relsClienteCfdis: RelClienteCfdi[]) => {
                resolve(relsClienteCfdis);
            },
                async (error) => {
                    reject(error);
                },
            );

        });
    }

    saveRelsCfdis(relsClienteCfdis: Array<{ idCliente: number, cfdis: RelClienteCfdi[] }>, idUsuario: any = null) {
        const distinctClients = [...new Set(relsClienteCfdis.map((i) => i.idCliente))];
        const bitacoraHandler = new BitacoraBusiness(); // bitacora
        return new Promise<number>((resolve, reject) => {
            const connection = getConnection();
            connection.transaction(async (manager) => {
                for (const idClienteValue of distinctClients) {
                    await manager.delete(RelClienteDireccionFlotillas, { idCliente: idClienteValue }).then(// error?
                        (data) => {
                            bitacoraHandler.saveRegister(idUsuario, RelClienteCfdi.name, 'delete', 'CATALOGOS', data); // bitacora
                        }, (error) => {
                            reject(error);
                        },
                    );
                }
                const relRepository = await manager.getRepository(RelClienteCfdi);
                for (const relItemCliente of relsClienteCfdis) {
                    if (relItemCliente.cfdis != undefined) {
                        await relRepository.save(relItemCliente.cfdis).then(
                            (data) => {
                                bitacoraHandler.saveRegister(idUsuario, RelClienteCfdi.name, 'insert', 'CATALOGOS', data); // bitacora
                            }, (error) => {

                                reject(error);
                            },
                        );
                    }
                }
                resolve(relsClienteCfdis.length);
            });
        });
    }
}
