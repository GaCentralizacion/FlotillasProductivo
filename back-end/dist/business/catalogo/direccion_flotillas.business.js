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
class DireccionFlotillasBusiness {
    getAllDireccionFlotillas() {
        const bitacoraHandler = new bitacora_business_1.BitacoraBusiness(); // bitacora instaciado
        return new Promise((resolve, reject) => {
            const connection = typeorm_1.getConnection();
            connection.manager.find(catalogo_1.DireccionFlotillas).then((direccionesFlotillas) => __awaiter(this, void 0, void 0, function* () {
                // bitacoraHandler.saveRegister(3, DireccionFlotillas.name, 'select', 'CATALOGOS', direccionesFlotillas); // guardado en bitacora
                resolve(direccionesFlotillas);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        });
    }
}
exports.DireccionFlotillasBusiness = DireccionFlotillasBusiness;
//# sourceMappingURL=direccion_flotillas.business.js.map