"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const express_json_validator_middleware_1 = require("express-json-validator-middleware");
const bitacora_1 = require("../business/bitacora");
const filtroEventosSchema = __importStar(require("../schemas/bitacora/eventos_log_filter.schema.json"));
const base_controller_1 = require("./base.controller");
class BitacoraController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.basePath = '/bitacora';
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        const validator = new express_json_validator_middleware_1.Validator({ allErros: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        this.router.post(`${this.basePath}/getEventos`, validate({ body: filtroEventosSchema }), this.getEventos.bind(this));
    }
    getEventos(request, response) {
        const filtroEventos = request.body;
        const bitacoraBussiness = new bitacora_1.BitacoraBusiness();
        bitacoraBussiness.getEventos(filtroEventos).then((eventoLogResult) => {
            response.status(200).send(eventoLogResult);
        }, (error) => {
            response.status(500).send(error);
        });
    }
}
exports.BitacoraController = BitacoraController;
//# sourceMappingURL=bitacora.controller.js.map