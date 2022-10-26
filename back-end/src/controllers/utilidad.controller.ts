import express = require('express');
import { Validator } from 'express-json-validator-middleware';
import { UtilidadBusiness } from '../business/catalogo';
import { UtilidadVista } from '../db/model/catalogo';
import { BaseController } from './base.controller';
import { IController } from './controller.interface';

export class UtilidadController extends BaseController implements IController {
    basePath = '/utilidad';
    router = express.Router();

    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        const validator = new Validator({ allErros: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        // UTILIDAD - COAL EHJ
        this.router.get(
            `${this.basePath}/getUtilidad/:idCotizacion`, this.getUtilidad.bind(this),
        );
    }

   // EHJ Utilidad
     getUtilidad(request: express.Request, response: express.Response) {
        const idCotizacion = (request.params.idCotizacion === undefined ? '' : request.params.idCotizacion) as string;
        const utilidadBusiness = new UtilidadBusiness();
        utilidadBusiness.getUtilidad(idCotizacion).then(
            (res: any) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }
}
