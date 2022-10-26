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
const seguridad_1 = require("../../db/model/seguridad");
class SeguridadBusiness {
    getUsuario(idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            connection.manager.findOne(seguridad_1.Usuario, { idUsuario }).then((usuario) => __awaiter(this, void 0, void 0, function* () {
                resolve(usuario);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getAllUsuarios() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            connection.manager.find(seguridad_1.Usuario).then((usuarios) => __awaiter(this, void 0, void 0, function* () {
                resolve(usuarios);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
}
exports.SeguridadBusiness = SeguridadBusiness;
//# sourceMappingURL=seguridad.business.js.map