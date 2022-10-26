"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const catalogo_1 = require("../../db/model/catalogo");
const bitacora_business_1 = require("../bitacora/bitacora.business");
class ClienteBussiness {
    getCliente(idCliente) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_ListadoClientes @filtroSelect='idCliente',@nombreCompleto=` + idCliente)
                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                resolve(resp);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getClientes(filtroCliente) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let condiciones = ``;
            const condExtra = [];
            const connection = typeorm_1.getConnection();
            if (filtroCliente.filtroSelect !== undefined) {
                condExtra.push(`@filtroSelect= '${filtroCliente.filtroSelect}'`);
            }
            if (filtroCliente.idCliente != undefined) {
                condExtra.push(`@idCliente= '${filtroCliente.idCliente}'`);
            }
            else {
                if (filtroCliente.nombreCompleto != undefined) {
                    condExtra.push(`@nombreCompleto= '${filtroCliente.nombreCompleto}'`);
                }
                if (filtroCliente.tipoPersona != undefined) {
                    condExtra.push(`@tipoPersona= '${filtroCliente.tipoPersona}'`);
                }
            }
            condiciones = condiciones + (condExtra.length > 0 ? condExtra.join(', ') : '');
            yield connection.query(`exec sp_Flotillas_ListadoClientes ${condiciones}`)
                .then((resp) => {
                const retorno = new catalogo_1.ClienteFilterResult();
                retorno.clientes = resp;
                resolve(retorno);
            })
                .catch(reject);
        }));
    }
    filtrarClientes(filtro, tipoPersona) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let condiciones = ``;
            const condExtra = [];
            const connection = typeorm_1.getConnection();
            if (filtro != undefined) {
                condExtra.push(`@nombreCompleto='${filtro}'`);
            }
            if (tipoPersona != undefined) {
                condExtra.push(`@tipoPersona='${tipoPersona}'`);
            }
            condiciones = condiciones + (condExtra.length > 0 ? condExtra.join(', ') : '');
            yield connection.query(`exec sp_Flotillas_ListadoClientes ${condiciones}`)
                .then((resp) => {
                if (!resp.length) {
                    reject({ status: 400, error: `No se han encontrado resultados con el filtro ${filtro}` });
                }
                resolve(resp);
            })
                .catch(reject);
        }));
    }
    getAllRelDireccionFlotillas() {
        const bitacoraHandler = new bitacora_business_1.BitacoraBusiness(); // bitacora instaciado
        return new Promise((resolve, reject) => {
            const connection = typeorm_1.getConnection();
            connection.manager.find(catalogo_1.RelClienteDireccionFlotillas).then((relsClienteDireccionFlotillas) => __awaiter(this, void 0, void 0, function* () {
                resolve(relsClienteDireccionFlotillas);
                // bitacoraHandler.saveRegister(3, RelClienteDireccionFlotillas.name, 'select', 'CATALOGOS', relsClienteDireccionFlotillas); // guardado en bitacora
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        });
    }
    saveRelsDireccionFlotillas(relsDireccionFlotillas, idUsuario) {
        const distinctClients = [...new Set(relsDireccionFlotillas.map((i) => i.idCliente))];
        const bitacoraHandler = new bitacora_business_1.BitacoraBusiness(); // bitacora
        return new Promise((resolve, reject) => {
            const connection = typeorm_1.getConnection();
            let hasError = false;
            connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                for (const idClienteValue of distinctClients) {
                    yield manager.delete(catalogo_1.RelClienteDireccionFlotillas, { idCliente: idClienteValue }).then((data) => {
                        bitacoraHandler.saveRegister(idUsuario, catalogo_1.RelClienteDireccionFlotillas.name, 'delete', 'CATALOGOS', data); // bitacora
                    }, (error) => {
                        hasError = true;
                        reject(error);
                    });
                }
                const relRepository = yield manager.getRepository(catalogo_1.RelClienteDireccionFlotillas);
                for (const relItemCliente of relsDireccionFlotillas) {
                    if (relItemCliente.direccionesFlotillas != undefined) {
                        yield relRepository.save(relItemCliente.direccionesFlotillas).then((data) => {
                            bitacoraHandler.saveRegister(idUsuario, catalogo_1.RelClienteDireccionFlotillas.name, 'insert', 'CATALOGOS', data); // bitacora
                        }, (error) => {
                            hasError = true;
                            reject(error);
                        });
                    }
                }
                resolve(relsDireccionFlotillas.length);
            }));
        });
    }
    getAllRelCfdis(idCliente = null) {
        const bitacoraHandler = new bitacora_business_1.BitacoraBusiness(); // bitacora
        return new Promise((resolve, reject) => {
            const connection = typeorm_1.getConnection();
            let condiciones = {};
            if (idCliente != undefined) {
                condiciones = { idCliente };
            }
            connection.manager.find(catalogo_1.RelClienteCfdi, condiciones).then((relsClienteCfdis) => __awaiter(this, void 0, void 0, function* () {
                resolve(relsClienteCfdis);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        });
    }
    saveRelsCfdis(relsClienteCfdis, idUsuario = null) {
        const distinctClients = [...new Set(relsClienteCfdis.map((i) => i.idCliente))];
        const bitacoraHandler = new bitacora_business_1.BitacoraBusiness(); // bitacora
        return new Promise((resolve, reject) => {
            const connection = typeorm_1.getConnection();
            connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                for (const idClienteValue of distinctClients) {
                    yield manager.delete(catalogo_1.RelClienteDireccionFlotillas, { idCliente: idClienteValue }).then(// error?
                    (data) => {
                        bitacoraHandler.saveRegister(idUsuario, catalogo_1.RelClienteCfdi.name, 'delete', 'CATALOGOS', data); // bitacora
                    }, (error) => {
                        reject(error);
                    });
                }
                const relRepository = yield manager.getRepository(catalogo_1.RelClienteCfdi);
                for (const relItemCliente of relsClienteCfdis) {
                    if (relItemCliente.cfdis != undefined) {
                        yield relRepository.save(relItemCliente.cfdis).then((data) => {
                            bitacoraHandler.saveRegister(idUsuario, catalogo_1.RelClienteCfdi.name, 'insert', 'CATALOGOS', data); // bitacora
                        }, (error) => {
                            reject(error);
                        });
                    }
                }
                resolve(relsClienteCfdis.length);
            }));
        });
    }
}
exports.ClienteBussiness = ClienteBussiness;
//# sourceMappingURL=cliente.business.js.map