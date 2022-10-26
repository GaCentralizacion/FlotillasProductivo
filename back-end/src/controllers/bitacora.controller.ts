import express = require('express');
import { Validator } from 'express-json-validator-middleware';
import { BitacoraBusiness } from '../business/bitacora';
import { EventoLog, EventoLogFilter, EventoLogFilterResult } from '../db/model/bitacora';
import * as filtroEventosSchema from '../schemas/bitacora/eventos_log_filter.schema.json';
import { BaseController } from './base.controller';
import { IController } from './controller.interface';

export class BitacoraController extends BaseController implements IController {
    basePath = '/bitacora';
    router = express.Router();

    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        const validator = new Validator({ allErros: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        this.router.post(
            `${this.basePath}/getEventos`,
            validate({ body: filtroEventosSchema }),
            this.getEventos.bind(this),
        );
    }

    private getEventos(request: express.Request, response: express.Response) {
        const filtroEventos = request.body as EventoLogFilter;
        const bitacoraBussiness = new BitacoraBusiness();
        bitacoraBussiness.getEventos(filtroEventos).then(
            (eventoLogResult: EventoLogFilterResult) => {
                response.status(200).send(eventoLogResult);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

}
