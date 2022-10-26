"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const express_json_validator_middleware_1 = require("express-json-validator-middleware");
const catalogo_1 = require("../business/catalogo");
const base_controller_1 = require("./base.controller");
class UtilidadController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.basePath = '/utilidad';
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        const validator = new express_json_validator_middleware_1.Validator({ allErros: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        // UTILIDAD - COAL EHJ
        this.router.get(`${this.basePath}/getUtilidad/:idCotizacion`, this.getUtilidad.bind(this));
    }
    // EHJ Utilidad
    getUtilidad(request, response) {
        const idCotizacion = (request.params.idCotizacion === undefined ? '' : request.params.idCotizacion);
        const utilidadBusiness = new catalogo_1.UtilidadBusiness();
        utilidadBusiness.getUtilidad(idCotizacion).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
}
exports.UtilidadController = UtilidadController;
//# sourceMappingURL=utilidad.controller.js.map