import express = require('express');
import { Validator } from 'express-json-validator-middleware';
import { resolve } from 'path';
import { AprobacionUtilidadBussiness } from '../business/aprobacion';
import { AprobacionUtilidad } from '../db/model/aprobacion';
import { BaseController } from './base.controller';
import { IController } from './controller.interface';

export class AprobacionController extends BaseController implements IController {
    basePath = '/aprobacion';
    router = express.Router();

    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        const validator = new Validator({ allErros: true });
        const validate = validator.validate;
        const ajv = validator.ajv;

        this.router.get(
            `${this.basePath}/getAllAprobacionUtilidad`, this.getAllAprobacionUtilidad.bind(this),
        );

        this.router.get(
            `${this.basePath}/getAprobacionUtilidadByUsuario/:idUsuario`, this.getAprobacionUtilidadByUsuario.bind(this),
        );

        this.router.get(
            `${this.basePath}/getAprobacionUtilidadByDireccion/:idDireccionFlotillas`, this.getAprobacionUtilidadByDireccion.bind(this),
        );

        this.router.post(
            `${this.basePath}/insertAprobacionUtilidadDireccion`, this.insertAprobacionUtilidadDireccion.bind(this),
        );

        this.router.delete(
            `${this.basePath}/removeAprobacionUtilidadDireccion/:idDireccionFlotillas/:idUsuario`, this.removeAprobacionUtilidadDireccion.bind(this),
        );

        this.router.post(
            `${this.basePath}/updateAprobacionUtilidadDireccion`, this.updateAprobacionUtilidadDireccion.bind(this),
        );
    }

    private getAllAprobacionUtilidad(request: express.Request, response: express.Response) {
        const aprobacionUtilidadBussiness = new AprobacionUtilidadBussiness();
        aprobacionUtilidadBussiness.getAllAprobacionUtilidad().then(
            (aprobaciones: AprobacionUtilidad[]) => {
                response.status(200).send(aprobaciones);
            }, (error) => {
                response.status(200).send(error);
            },
        );
    }

    private getAprobacionUtilidadByUsuario(request: express.Request, response: express.Response) {
        const aprobacionUtilidadBussiness = new AprobacionUtilidadBussiness();
        const idUsuario = Number((request.params.idusuario) ? request.headers.idusuario : 0);
        aprobacionUtilidadBussiness.getAprobacionUtilidadByUsuario(idUsuario).then(
            (aprobaciones: AprobacionUtilidad[]) => {
                response.status(200).send(aprobaciones);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getAprobacionUtilidadByDireccion(request: express.Request, response: express.Response) {
        const aprobacionUtilidadBussiness = new AprobacionUtilidadBussiness();
        const idDireccionFlotillas = request.params.idDireccionFlotillas;
        aprobacionUtilidadBussiness.getAprobacionUtilidadByDireccion(idDireccionFlotillas).then(
            (aprobaciones: AprobacionUtilidad[]) => {
                response.status(200).send(aprobaciones);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private insertAprobacionUtilidadDireccion(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body as AprobacionUtilidad[];
        data.map((d) => { d.idUsuarioModificacion = idUsuario; d.fechaModificacion = new Date(); });
        const aprobacionUtilidadBussiness = new AprobacionUtilidadBussiness();
        aprobacionUtilidadBussiness.insertAprobacionUtilidadDireccion(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private removeAprobacionUtilidadDireccion(request: express.Request, response: express.Response) {
        const aprobacionUtilidadBussiness = new AprobacionUtilidadBussiness();
        const idDireccionFlotillas = request.params.idDireccionFlotillas;
        const idUsuario = Number((request.params.idUsuario) ? request.params.idUsuario : 0);
        aprobacionUtilidadBussiness.removeAprobacionUtilidadDireccion(idDireccionFlotillas, idUsuario).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private updateAprobacionUtilidadDireccion(request: express.Request, response: express.Response) {
        const idDireccion = request.body.idDireccion;
        const idUsuario = request.body.idUsuario;
        const margenUtilidad = request.body.margenUtilidad;
        const idUsuarioModificacion = request.body.idUsuarioModificacion;

        const aprobacionUtilidadBussiness = new AprobacionUtilidadBussiness();
        aprobacionUtilidadBussiness.updateAprobacionUtilidadDireccion(idDireccion, idUsuario, margenUtilidad, idUsuarioModificacion).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );

    }

}
