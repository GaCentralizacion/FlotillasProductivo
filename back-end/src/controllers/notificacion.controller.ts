import express = require('express');
import { Validator } from 'express-json-validator-middleware';
import { NotificacionBusiness } from '../business/notificacion';
import { Notificacion } from '../db/model/notificacion';
import * as postNotificacion from '../schemas/notificacion/notificacion.schema.json';
import { BaseController } from './base.controller';
import { IController } from './controller.interface';

export class NotificacionController extends BaseController implements IController {
    basePath = '/notificacion';
    router = express.Router();

    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        const validator = new Validator({ allErrors: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        this.router.post(
            `${this.basePath}/add`,
            validate({ body: postNotificacion }),
            this.addNotificacion.bind(this),
        );

        this.router.get(
            `${this.basePath}/marcarLeida/:idNotificacion`,
            this.marcarLeida.bind(this),
        );

        this.router.get(
            `${this.basePath}/marcarLeidaUsuario/:idGrupoChat/:idTipoNotificacion`,
            this.marcarLeidaUsuario.bind(this),
        );

        this.router.get(
            `${this.basePath}/getAll/:cantidad`,
            this.getNotificaciones.bind(this),
        );

        this.router.get(
            `${this.basePath}/getAll`,
            this.getNotificaciones.bind(this),
        );
    }

    private addNotificacion(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const notificacion = request.body as Notificacion;
        notificacion.idUsuarioModificacion = idUsuario;
        const notificacionBusiness = new NotificacionBusiness();
        notificacionBusiness.addNotificacion(notificacion)
            .then((affected: number) => {
                response.status(200).json({ affectedRows: affected });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private marcarLeida(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idNotificacion = request.params.idNotificacion as string;
        const notificacionBusiness = new NotificacionBusiness();
        notificacionBusiness.marcarLeida(idNotificacion, idUsuario)
            .then((affected: number) => {
                response.status(200).json({ affectedRows: affected });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private marcarLeidaUsuario(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idGrupoChat = request.params.idGrupoChat as string;
        const idTipoNotificacion = Number(request.params.idTipoNotificacion);
        const notificacionBusiness = new NotificacionBusiness();
        notificacionBusiness.marcarLeidaUsuario(idGrupoChat, idTipoNotificacion, idUsuario)
            .then((affected: number) => {
                response.status(200).json({ affectedRows: affected });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private getNotificaciones(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        let cantidad = null;
        if (request.params.cantidad && !isNaN(Number(request.params.cantidad))) {
            cantidad = Number(request.params.cantidad);
        }
        const notificacionBusiness = new NotificacionBusiness();
        notificacionBusiness.getNotificaciones(idUsuario, cantidad)
            .then((notificaciones: Notificacion[]) => {
                response.status(200).json(notificaciones);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }
}
