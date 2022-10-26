"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_httpexceptions_1 = require("ts-httpexceptions");
/**
 * Controlador base del cual todos deben heredar
 */
class BaseController {
    /**
     * Función de manejo de errores
     * @param response Objeto para enviar respuestas a express
     * @param error Error a manejar
     */
    errorHandler(response, error) {
        if (error instanceof ts_httpexceptions_1.Exception) {
            return response.status(error.status).send(error.message);
        }
        if (error instanceof Error) {
            return response.status(500).send(error.message);
        }
        return response.status(500).json(error);
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=base.controller.js.map