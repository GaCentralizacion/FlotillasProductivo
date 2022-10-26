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
class SucursalBusiness {
    getSucursales(idEmpresa) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query('exec sp_bpro_sucursales @Empresa = ' + idEmpresa).then((resultadoSucursales) => {
                const sucursales = [];
                resultadoSucursales.map((resultado) => {
                    sucursales.push({ idSucursal: resultado.IdSucursal, nombre: resultado.Descripcion });
                });
                resolve(sucursales);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getSucursalesExternas(idEmpresa) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query('exec catalogo.SEL_SUCURSAL_SP @Empresa = ' + idEmpresa).then((resultadoSucursales) => {
                const sucursales = [];
                resultadoSucursales.map((resultado) => {
                    sucursales.push({ idSucursal: resultado.IdSucursal, nombre: resultado.Descripcion });
                });
                resolve(sucursales);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
}
exports.SucursalBusiness = SucursalBusiness;
//# sourceMappingURL=sucursal.business.js.map