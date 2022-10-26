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
/* export class FinancieraBusiness {
    getFinancieras(idMarca: string): Promise<Financiera[]> {
        return new Promise<Financiera[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec sp_bpro_financieras @Marca = ' + idMarca).then((resultadoFinancieras: any[]) => {
                const financieras: Financiera[] = [];
                resultadoFinancieras.map((resultado) => {
                    financieras.push({ idFinanciera: resultado.IdFinanciera, nombre: resultado.Descripcion });
                });
                resolve(financieras);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }
}
 */
class FinancieraBusiness {
    getFinancieras(idSucursal) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query('exec sp_bpro_financieras @Sucursal = ' + idSucursal).then((resultadoFinancieras) => {
                const financieras = [];
                resultadoFinancieras.map((resultado) => {
                    financieras.push({ idFinanciera: resultado.IdFinanciera, nombre: resultado.Financiera });
                });
                resolve(financieras);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getFinancierasExternas(idSucursal) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query('exec catalogo.SEL_FINANCIERA_SP @Sucursal = ' + idSucursal).then((resultadoFinancieras) => {
                const financieras = [];
                resultadoFinancieras.map((resultado) => {
                    financieras.push({ idFinanciera: resultado.IdFinanciera, nombre: resultado.Financiera });
                });
                resolve(financieras);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
}
exports.FinancieraBusiness = FinancieraBusiness;
//# sourceMappingURL=financiera.business.js.map