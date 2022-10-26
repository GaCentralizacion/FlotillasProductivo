"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const express_json_validator_middleware_1 = require("express-json-validator-middleware");
const aprobacion_1 = require("../business/aprobacion");
const base_controller_1 = require("./base.controller");
class AprobacionController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.basePath = '/aprobacion';
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        const validator = new express_json_validator_middleware_1.Validator({ allErros: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        this.router.get(`${this.basePath}/getAllAprobacionUtilidad`, this.getAllAprobacionUtilidad.bind(this));
        this.router.get(`${this.basePath}/getAprobacionUtilidadByUsuario/:idUsuario`, this.getAprobacionUtilidadByUsuario.bind(this));
        this.router.get(`${this.basePath}/getAprobacionUtilidadByDireccion/:idDireccionFlotillas`, this.getAprobacionUtilidadByDireccion.bind(this));
        this.router.post(`${this.basePath}/insertAprobacionUtilidadDireccion`, this.insertAprobacionUtilidadDireccion.bind(this));
        this.router.delete(`${this.basePath}/removeAprobacionUtilidadDireccion/:idDireccionFlotillas/:idUsuario`, this.removeAprobacionUtilidadDireccion.bind(this));
        this.router.post(`${this.basePath}/updateAprobacionUtilidadDireccion`, this.updateAprobacionUtilidadDireccion.bind(this));
    }
    getAllAprobacionUtilidad(request, response) {
        const aprobacionUtilidadBussiness = new aprobacion_1.AprobacionUtilidadBussiness();
        aprobacionUtilidadBussiness.getAllAprobacionUtilidad().then((aprobaciones) => {
            response.status(200).send(aprobaciones);
        }, (error) => {
            response.status(200).send(error);
        });
    }
    getAprobacionUtilidadByUsuario(request, response) {
        const aprobacionUtilidadBussiness = new aprobacion_1.AprobacionUtilidadBussiness();
        const idUsuario = Number((request.params.idusuario) ? request.headers.idusuario : 0);
        aprobacionUtilidadBussiness.getAprobacionUtilidadByUsuario(idUsuario).then((aprobaciones) => {
            response.status(200).send(aprobaciones);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getAprobacionUtilidadByDireccion(request, response) {
        const aprobacionUtilidadBussiness = new aprobacion_1.AprobacionUtilidadBussiness();
        const idDireccionFlotillas = request.params.idDireccionFlotillas;
        aprobacionUtilidadBussiness.getAprobacionUtilidadByDireccion(idDireccionFlotillas).then((aprobaciones) => {
            response.status(200).send(aprobaciones);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    insertAprobacionUtilidadDireccion(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.map((d) => { d.idUsuarioModificacion = idUsuario; d.fechaModificacion = new Date(); });
        const aprobacionUtilidadBussiness = new aprobacion_1.AprobacionUtilidadBussiness();
        aprobacionUtilidadBussiness.insertAprobacionUtilidadDireccion(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    removeAprobacionUtilidadDireccion(request, response) {
        const aprobacionUtilidadBussiness = new aprobacion_1.AprobacionUtilidadBussiness();
        const idDireccionFlotillas = request.params.idDireccionFlotillas;
        const idUsuario = Number((request.params.idUsuario) ? request.params.idUsuario : 0);
        aprobacionUtilidadBussiness.removeAprobacionUtilidadDireccion(idDireccionFlotillas, idUsuario).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    updateAprobacionUtilidadDireccion(request, response) {
        const idDireccion = request.body.idDireccion;
        const idUsuario = request.body.idUsuario;
        const margenUtilidad = request.body.margenUtilidad;
        const idUsuarioModificacion = request.body.idUsuarioModificacion;
        const aprobacionUtilidadBussiness = new aprobacion_1.AprobacionUtilidadBussiness();
        aprobacionUtilidadBussiness.updateAprobacionUtilidadDireccion(idDireccion, idUsuario, margenUtilidad, idUsuarioModificacion).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
}
exports.AprobacionController = AprobacionController;
//# sourceMappingURL=aprobacion.controller.js.map