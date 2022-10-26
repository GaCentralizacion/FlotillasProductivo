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
class UbicacionTrasladoBusiness {
    getUbicacionTraslados() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.manager.find(catalogo_1.UbicacionTraslado).then((ubicacionTraslados) => {
                resolve(ubicacionTraslados);
            }, (err) => {
                reject(err);
            });
        }));
    }
    saveUbicacionTraslados(data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            for (const ele of data) {
                const connection = typeorm_1.getConnection();
                yield connection.transaction('SERIALIZABLE', (manager) => __awaiter(this, void 0, void 0, function* () {
                    const ubicacionTrasladosRepository = yield manager.getRepository(catalogo_1.UbicacionTraslado);
                    if (ele.idUbicacionTraslado !== null && ele.idUbicacionTraslado !== undefined) {
                        const eleToupdate = yield ubicacionTrasladosRepository.findOne(ele.idUbicacionTraslado);
                        eleToupdate.idUbicacionTraslado = ele.idUbicacionTraslado;
                        eleToupdate.nombre = ele.nombre;
                        eleToupdate.descripcion = ele.descripcion;
                        eleToupdate.direccion = ele.direccion;
                        yield ubicacionTrasladosRepository.delete(ele.idUbicacionTraslado).then(() => __awaiter(this, void 0, void 0, function* () {
                            yield ubicacionTrasladosRepository.save(eleToupdate).then((res) => {
                                resolve(res);
                            }, (err) => {
                                reject(err);
                            });
                        }), (err) => {
                            reject(err);
                        });
                    }
                    else {
                        let maxId = (yield ubicacionTrasladosRepository.createQueryBuilder().select('MAX(UbicacionTraslado.idUbicacionTraslado)', 'max').getRawOne()).max;
                        maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                        ele.idUbicacionTraslado = maxId;
                        console.log(ele);
                        yield ubicacionTrasladosRepository.save(ele).then((res) => {
                            resolve(res);
                        }, (err) => {
                            console.log(err);
                            reject(err);
                        });
                    }
                }));
            }
        }));
    }
    removeUbicacionTraslados(idUbicacionTraslado) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const ubicacionTrasladosRepository = yield manager.getRepository(catalogo_1.UbicacionTraslado);
                yield ubicacionTrasladosRepository.delete({ idUbicacionTraslado }).then((res) => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            }));
        }));
    }
}
exports.UbicacionTrasladoBusiness = UbicacionTrasladoBusiness;
//# sourceMappingURL=ubicacion_traslado.business.js.map