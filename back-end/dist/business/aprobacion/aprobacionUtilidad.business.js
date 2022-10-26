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
const aprobacion_1 = require("../../db/model/aprobacion");
class AprobacionUtilidadBussiness {
    getAllAprobacionUtilidad() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            connection.manager.find(aprobacion_1.AprobacionUtilidad).then((aprobaciones) => __awaiter(this, void 0, void 0, function* () {
                resolve(aprobaciones);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getAprobacionUtilidadByUsuario(idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            connection.manager.find(aprobacion_1.AprobacionUtilidad, { idUsuario }).then((aprobaciones) => __awaiter(this, void 0, void 0, function* () {
                resolve(aprobaciones);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getAprobacionUtilidadByDireccion(idDireccionFlotillas) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            connection.manager.find(aprobacion_1.AprobacionUtilidad, { idDireccionFlotillas }).then((aprobaciones) => __awaiter(this, void 0, void 0, function* () {
                resolve(aprobaciones);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    insertAprobacionUtilidadDireccion(data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const aprobacionUnidadDireccionRepository = yield manager.getRepository(aprobacion_1.AprobacionUtilidad);
                yield aprobacionUnidadDireccionRepository.save(data).then((res) => __awaiter(this, void 0, void 0, function* () {
                    resolve(res);
                }), (error) => { reject(error); });
            }));
        }));
    }
    removeAprobacionUtilidadDireccion(idDireccionFlotillas, idUsuario) {
        return new Promise((resolve, rejects) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const aprobacionUnidadDireccionRepository = yield manager.getRepository(aprobacion_1.AprobacionUtilidad);
                yield aprobacionUnidadDireccionRepository.delete({ idDireccionFlotillas, idUsuario }).then((res) => {
                    resolve(res);
                }, (error) => {
                    rejects(error);
                });
            }));
        }));
    }
    updateAprobacionUtilidadDireccion(idDireccion, idUsuario, margenUtilidad, idUsuarioModificacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const aprobacionUnidadDireccionRepository = yield connection.getRepository(aprobacion_1.AprobacionUtilidad);
            yield aprobacionUnidadDireccionRepository.update({ idDireccionFlotillas: idDireccion }, { idUsuario, margenUtilidad, idUsuarioModificacion, fechaModificacion: new Date() });
            resolve(1);
        }));
    }
}
exports.AprobacionUtilidadBussiness = AprobacionUtilidadBussiness;
//# sourceMappingURL=aprobacionUtilidad.business.js.map