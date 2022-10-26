import express = require('express');
import { Validator } from 'express-json-validator-middleware';
import { SeguridadBusiness } from '../business/seguridad';
import { Usuario } from '../db/model/seguridad';
import { BaseController } from './base.controller';
import { IController } from './controller.interface';

export class SeguridadController extends BaseController implements IController {
    basePath = '/seguridad';
    router = express.Router();

    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get(
            `${this.basePath}/usuario/get/:idUsuario`,
            this.getUsuario.bind(this),
        );
        this.router.get(
            `${this.basePath}/usuario/getAll`,
            this.getAllUsuarios.bind(this),
        );
    }

    private getUsuario(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const seguridadBusiness = new SeguridadBusiness();
        seguridadBusiness.getUsuario(idUsuario).then(
            (usuario: Usuario) => {
                response.json(usuario);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getAllUsuarios(request: express.Request, response: express.Response) {
        const seguridadBusiness = new SeguridadBusiness();
        seguridadBusiness.getAllUsuarios().then(
            (usuarios: Usuario[]) => {
                response.json(usuarios);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }
}
