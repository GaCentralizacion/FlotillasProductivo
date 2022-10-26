import express = require('express');
import { Validator } from 'express-json-validator-middleware';
import { TrasladoBusiness, UbicacionTrasladoBusiness } from '../business/catalogo';
import { Traslado, UbicacionTraslado } from '../db/model/catalogo';
import * as trasladosSchemas from '../schemas/catalogo/traslados/traslado.schema.json';
import * as trasladosArraySchemas from '../schemas/catalogo/traslados/traslado_array.schema.json';
import * as ubicacionTrasladoSchemas from '../schemas/catalogo/traslados/ubicacion_traslado.schema.json';
import * as ubicacionTrasladoArraySchemas from '../schemas/catalogo/traslados/ubicacion_traslado_array.schema.json';
import { BaseController } from './base.controller';
import { IController } from './controller.interface';

export class TrasladosController extends BaseController implements IController {
    basePath = '/catalogo';
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
            `${this.basePath}/traslados/getUbicacionTraslados`, this.getUbicacionTraslados.bind(this),
        );
        this.router.get(
            `${this.basePath}/traslados/getTraslados`, this.getTraslados.bind(this),
        );

        const schemaUbicacionTrasladosArray = ajv
            .addSchema(ubicacionTrasladoSchemas)
            .compile(ubicacionTrasladoArraySchemas).schema;
        this.router.post(
            `${this.basePath}/traslados/saveUbicacionTraslados`,
            validate({ body: schemaUbicacionTrasladosArray }),
            this.saveUbicacionTraslados.bind(this),
        );

        const schemaTrasladosArray = ajv
            .addSchema(trasladosSchemas)
            .compile(trasladosArraySchemas).schema;
        this.router.post(
            `${this.basePath}/traslados/saveTraslados`,
            validate({ body: schemaTrasladosArray }),
            this.saveTraslado.bind(this),
        );

        this.router.delete(
            `${this.basePath}/traslados/removeUbicacionTraslados/:idLugar`,
            this.removeUbicacionTraslados.bind(this),
        );

        this.router.delete(
            `${this.basePath}/traslados/removeTraslados/:idTraslado`,
            this.removeTraslado.bind(this),
        );
        // OCT 99 20201204 TRASLADOS POSTERIORES

        this.router.post(
            `${this.basePath}/traslados/postGuardaTrasladoPosterior`,
            this.postGuardaTrasladoPosterior.bind(this),
        );

        // CHK 20210106 postInsertaTrasladosMovs

        this.router.post(
            `${this.basePath}/traslados/postInsertaTrasladosMovs`,
            this.postInsertaTrasladosMovs.bind(this),
        );

        this.router.get(
            `${this.basePath}/traslados/getListaVinesTraslados/:idCotizacion`,
            this.getListaVinesTraslados.bind(this),
        );
        // OCT 99 20201214 obtiene unidades con o sin vin, para traslados posteriores
        this.router.get(
            `${this.basePath}/traslados/getListaUnidadesTraslados/:idCotizacion`,
            this.getListaUnidadesTraslados.bind(this),
        );
        // OCT 99 20201214 lista unidades configuradas para armar traslados posteriores
        this.router.get(
            `${this.basePath}/traslados/getListaUnidadesConfiguradas/:idCotizacion`,
            this.getListaUnidadesConfiguradas.bind(this),
        );
        // OCT 99 20201214 Obtiene datos de traslado posterior
        this.router.get(
            `${this.basePath}/traslados/getDatosTraslado/:idCotizacion/:idCotizacionTraslado`,
            this.getDatosTraslado.bind(this),
        );
        // OCT 99 20201215 lista traslados por cotizacion en posteriores
        this.router.get(
            `${this.basePath}/traslados/getListadoTrasladosCotizacion/:idCotizacion`,
            this.getListadoTrasladosCotizacion.bind(this),
        );
        // OCT 99 20210106 Elimina traslados posteriores de MOV antes de haber enviado a BPRO
        this.router.delete(
            `${this.basePath}/traslados/eliminaTrasladoPosteriorMov/:idCotizacionTraslado`,
            this.eliminaTrasladoPosteriorMov.bind(this),
        );

        // chk - 07 Ene 2021 Lista traslados mov
        this.router.get(
            `${this.basePath}/traslados/listarTrasladosPosteriores/:idCotizacion`,
            this.getListarTrasladosPosteriores.bind(this),
        );

        // OCT 99 20210302 obtiene listado del traslado en modal para consultar/editar traslados POSTAD
        this.router.get(
            `${this.basePath}/traslados/getListadoTrasladoDetallePost/:idCotizacion/:idCotizacionTraslado`,
            this.getListadoTrasladoDetallePost.bind(this),
        );

        // OCT 99 20210308 obtiene listado del traslado en modal para editar traslados POSTAD
        this.router.get(
            `${this.basePath}/traslados/getObtenerDatosEdicionTrasladoPost/:idCotizacion/:idCotizacionTraslado`,
            this.getObtenerDatosEdicionTrasladoPost.bind(this),
        );

        // OCT 99 20210308 edicion de traslado posterior
        this.router.post(
            `${this.basePath}/traslados/postEditaTrasladosMovs`,
            this.postEditaTrasladosMovs.bind(this),
        );
    }

    getUbicacionTraslados(request: express.Request, response: express.Response) {
        const ubicacionTrasladoBusiness = new UbicacionTrasladoBusiness();
        ubicacionTrasladoBusiness.getUbicacionTraslados().then(
            (ubicacionTraslados: UbicacionTraslado[]) => {
                response.status(200).send(ubicacionTraslados);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }

    getTraslados(request: express.Request, response: express.Response) {
        const trasladoBusiness = new TrasladoBusiness();
        trasladoBusiness.getTraslado().then(
            (traslados: Traslado[]) => {
                response.status(200).send(traslados);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }

    saveUbicacionTraslados(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const ubicacionTrasladoBusiness = new UbicacionTrasladoBusiness();
        const data = request.body as UbicacionTraslado[];
        data.map((d) => { d.idUsuarioModificacion = idUsuario; d.fechaModificacion = new Date(); });
        ubicacionTrasladoBusiness.saveUbicacionTraslados(data).then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }

    saveTraslado(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const trasladoBusiness = new TrasladoBusiness();
        const data = request.body as Traslado[];
        data.map((d) => { d.idUsuarioModificacion = idUsuario; d.fechaModificacion = new Date(); });
        trasladoBusiness.saveTraslados(data).then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }

    removeUbicacionTraslados(request: express.Request, response: express.Response) {
        const ubicacionTrasladoBusiness = new UbicacionTrasladoBusiness();
        const data = Number(request.params.idLugar);
        ubicacionTrasladoBusiness.removeUbicacionTraslados(data).then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }

    removeTraslado(request: express.Request, response: express.Response) {
        const trasladoBusiness = new TrasladoBusiness();
        const data = Number(request.params.idTraslado);
        trasladoBusiness.removeTraslado(data).then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }

    // OCT 99 20201204 TRASLADOS POSTERIORES

    postGuardaTrasladoPosterior(request: express.Request, response: express.Response) {
        const trasladoBusiness = new TrasladoBusiness();
        const traslado = request.body;

        trasladoBusiness.postGuardaTrasladoPosterior(traslado).then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }

    postInsertaTrasladosMovs(request: express.Request, response: express.Response) {
        const trasladoBusiness = new TrasladoBusiness();
        const traslado = request.body;

        trasladoBusiness.postInsertaTrasladosMovs(traslado).then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }

    getListaVinesTraslados(request: express.Request, response: express.Response) {
        const trasladoBusiness = new TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;

        trasladoBusiness.getListaVinesTraslados(idCotizacion).then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }

    // OCT 99 20201214 obtiene unidades con o sin vin, para traslados posteriores
    getListaUnidadesTraslados(request: express.Request, response: express.Response) {
        const trasladoBusiness = new TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;

        trasladoBusiness.getListaUnidadesTraslados(idCotizacion).then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }
    // OCT 99 20201214 lista unidades configuradas para armar traslados posteriores
    getListaUnidadesConfiguradas(request: express.Request, response: express.Response) {
        const trasladoBusiness = new TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;

        trasladoBusiness.getListaUnidadesConfiguradas(idCotizacion).then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }
    // OCT 99 20201215 lista traslados por cotizacion en posteriores
    getListadoTrasladosCotizacion(request: express.Request, response: express.Response) {
        const trasladoBusiness = new TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;

        trasladoBusiness.getListadoTrasladosCotizacion(idCotizacion).then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }
    // OCT 99 20201214 Obtiene datos de traslado posterior
    getDatosTraslado(request: express.Request, response: express.Response) {
        const trasladoBusiness = new TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;
        const idCotizacionTraslado = Number(request.params.idCotizacionTraslado);

        trasladoBusiness.getDatosTraslado(idCotizacion, idCotizacionTraslado).then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }

    // OCT 99 20210106 Elimina traslados posteriores de MOV antes de haber enviado a BPRO
    eliminaTrasladoPosteriorMov(request: express.Request, response: express.Response) {
        const trasladoBusiness = new TrasladoBusiness();
        const traslado = request.params;
        trasladoBusiness.eliminaTrasladoPosteriorMov(traslado).then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }

    // CHK - 07 ene 2021 Lista traslados mov
    getListarTrasladosPosteriores(request: express.Request, response: express.Response) {
        const trasladoBusiness = new TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;

        trasladoBusiness.getListarTrasladosPosteriores(idCotizacion)
        .then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }

    // OCT 99 20210302 obtiene listado del traslado en modal para consultar/editar traslados POSTAD
    getListadoTrasladoDetallePost(request: express.Request, response: express.Response) {
        const trasladoBusiness = new TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;
        const idCotizacionTraslado = Number(request.params.idCotizacionTraslado);

        trasladoBusiness.getListadoTrasladoDetallePost(idCotizacion, idCotizacionTraslado)
        .then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }

    // OCT 99 20210308 obtiene listado del traslado en modal para editar traslados POSTAD
    getObtenerDatosEdicionTrasladoPost(request: express.Request, response: express.Response) {
        const trasladoBusiness = new TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;
        const idCotizacionTraslado = Number(request.params.idCotizacionTraslado);

        trasladoBusiness.getObtenerDatosEdicionTrasladoPost(idCotizacion, idCotizacionTraslado)
        .then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }

    // OCT 99 20210308 edicion de traslado posterior
    postEditaTrasladosMovs(request: express.Request, response: express.Response) {
        const trasladoBusiness = new TrasladoBusiness();
        const traslado = request.body;

        console.log('postEditaTrasladosMovs traslado: ');
        console.log(traslado);

        trasladoBusiness.postEditaTrasladosMovs(traslado).then(
            (res) => {
                response.status(200).send(res);
            },
            (err) => {
                response.status(500).send(err);
            },
        );
    }
}
