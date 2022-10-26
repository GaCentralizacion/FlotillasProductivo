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
const catalogo_1 = require("../business/catalogo");
const trasladosSchemas = __importStar(require("../schemas/catalogo/traslados/traslado.schema.json"));
const trasladosArraySchemas = __importStar(require("../schemas/catalogo/traslados/traslado_array.schema.json"));
const ubicacionTrasladoSchemas = __importStar(require("../schemas/catalogo/traslados/ubicacion_traslado.schema.json"));
const ubicacionTrasladoArraySchemas = __importStar(require("../schemas/catalogo/traslados/ubicacion_traslado_array.schema.json"));
const base_controller_1 = require("./base.controller");
class TrasladosController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.basePath = '/catalogo';
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        const validator = new express_json_validator_middleware_1.Validator({ allErros: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        this.router.get(`${this.basePath}/traslados/getUbicacionTraslados`, this.getUbicacionTraslados.bind(this));
        this.router.get(`${this.basePath}/traslados/getTraslados`, this.getTraslados.bind(this));
        const schemaUbicacionTrasladosArray = ajv
            .addSchema(ubicacionTrasladoSchemas)
            .compile(ubicacionTrasladoArraySchemas).schema;
        this.router.post(`${this.basePath}/traslados/saveUbicacionTraslados`, validate({ body: schemaUbicacionTrasladosArray }), this.saveUbicacionTraslados.bind(this));
        const schemaTrasladosArray = ajv
            .addSchema(trasladosSchemas)
            .compile(trasladosArraySchemas).schema;
        this.router.post(`${this.basePath}/traslados/saveTraslados`, validate({ body: schemaTrasladosArray }), this.saveTraslado.bind(this));
        this.router.delete(`${this.basePath}/traslados/removeUbicacionTraslados/:idLugar`, this.removeUbicacionTraslados.bind(this));
        this.router.delete(`${this.basePath}/traslados/removeTraslados/:idTraslado`, this.removeTraslado.bind(this));
        // OCT 99 20201204 TRASLADOS POSTERIORES
        this.router.post(`${this.basePath}/traslados/postGuardaTrasladoPosterior`, this.postGuardaTrasladoPosterior.bind(this));
        // CHK 20210106 postInsertaTrasladosMovs
        this.router.post(`${this.basePath}/traslados/postInsertaTrasladosMovs`, this.postInsertaTrasladosMovs.bind(this));
        this.router.get(`${this.basePath}/traslados/getListaVinesTraslados/:idCotizacion`, this.getListaVinesTraslados.bind(this));
        // OCT 99 20201214 obtiene unidades con o sin vin, para traslados posteriores
        this.router.get(`${this.basePath}/traslados/getListaUnidadesTraslados/:idCotizacion`, this.getListaUnidadesTraslados.bind(this));
        // OCT 99 20201214 lista unidades configuradas para armar traslados posteriores
        this.router.get(`${this.basePath}/traslados/getListaUnidadesConfiguradas/:idCotizacion`, this.getListaUnidadesConfiguradas.bind(this));
        // OCT 99 20201214 Obtiene datos de traslado posterior
        this.router.get(`${this.basePath}/traslados/getDatosTraslado/:idCotizacion/:idCotizacionTraslado`, this.getDatosTraslado.bind(this));
        // OCT 99 20201215 lista traslados por cotizacion en posteriores
        this.router.get(`${this.basePath}/traslados/getListadoTrasladosCotizacion/:idCotizacion`, this.getListadoTrasladosCotizacion.bind(this));
        // OCT 99 20210106 Elimina traslados posteriores de MOV antes de haber enviado a BPRO
        this.router.delete(`${this.basePath}/traslados/eliminaTrasladoPosteriorMov/:idCotizacionTraslado`, this.eliminaTrasladoPosteriorMov.bind(this));
        // chk - 07 Ene 2021 Lista traslados mov
        this.router.get(`${this.basePath}/traslados/listarTrasladosPosteriores/:idCotizacion`, this.getListarTrasladosPosteriores.bind(this));
        // OCT 99 20210302 obtiene listado del traslado en modal para consultar/editar traslados POSTAD
        this.router.get(`${this.basePath}/traslados/getListadoTrasladoDetallePost/:idCotizacion/:idCotizacionTraslado`, this.getListadoTrasladoDetallePost.bind(this));
        // OCT 99 20210308 obtiene listado del traslado en modal para editar traslados POSTAD
        this.router.get(`${this.basePath}/traslados/getObtenerDatosEdicionTrasladoPost/:idCotizacion/:idCotizacionTraslado`, this.getObtenerDatosEdicionTrasladoPost.bind(this));
        // OCT 99 20210308 edicion de traslado posterior
        this.router.post(`${this.basePath}/traslados/postEditaTrasladosMovs`, this.postEditaTrasladosMovs.bind(this));
    }
    getUbicacionTraslados(request, response) {
        const ubicacionTrasladoBusiness = new catalogo_1.UbicacionTrasladoBusiness();
        ubicacionTrasladoBusiness.getUbicacionTraslados().then((ubicacionTraslados) => {
            response.status(200).send(ubicacionTraslados);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    getTraslados(request, response) {
        const trasladoBusiness = new catalogo_1.TrasladoBusiness();
        trasladoBusiness.getTraslado().then((traslados) => {
            response.status(200).send(traslados);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    saveUbicacionTraslados(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const ubicacionTrasladoBusiness = new catalogo_1.UbicacionTrasladoBusiness();
        const data = request.body;
        data.map((d) => { d.idUsuarioModificacion = idUsuario; d.fechaModificacion = new Date(); });
        ubicacionTrasladoBusiness.saveUbicacionTraslados(data).then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    saveTraslado(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const trasladoBusiness = new catalogo_1.TrasladoBusiness();
        const data = request.body;
        data.map((d) => { d.idUsuarioModificacion = idUsuario; d.fechaModificacion = new Date(); });
        trasladoBusiness.saveTraslados(data).then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    removeUbicacionTraslados(request, response) {
        const ubicacionTrasladoBusiness = new catalogo_1.UbicacionTrasladoBusiness();
        const data = Number(request.params.idLugar);
        ubicacionTrasladoBusiness.removeUbicacionTraslados(data).then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    removeTraslado(request, response) {
        const trasladoBusiness = new catalogo_1.TrasladoBusiness();
        const data = Number(request.params.idTraslado);
        trasladoBusiness.removeTraslado(data).then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT 99 20201204 TRASLADOS POSTERIORES
    postGuardaTrasladoPosterior(request, response) {
        const trasladoBusiness = new catalogo_1.TrasladoBusiness();
        const traslado = request.body;
        trasladoBusiness.postGuardaTrasladoPosterior(traslado).then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    postInsertaTrasladosMovs(request, response) {
        const trasladoBusiness = new catalogo_1.TrasladoBusiness();
        const traslado = request.body;
        trasladoBusiness.postInsertaTrasladosMovs(traslado).then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    getListaVinesTraslados(request, response) {
        const trasladoBusiness = new catalogo_1.TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;
        trasladoBusiness.getListaVinesTraslados(idCotizacion).then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT 99 20201214 obtiene unidades con o sin vin, para traslados posteriores
    getListaUnidadesTraslados(request, response) {
        const trasladoBusiness = new catalogo_1.TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;
        trasladoBusiness.getListaUnidadesTraslados(idCotizacion).then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT 99 20201214 lista unidades configuradas para armar traslados posteriores
    getListaUnidadesConfiguradas(request, response) {
        const trasladoBusiness = new catalogo_1.TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;
        trasladoBusiness.getListaUnidadesConfiguradas(idCotizacion).then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT 99 20201215 lista traslados por cotizacion en posteriores
    getListadoTrasladosCotizacion(request, response) {
        const trasladoBusiness = new catalogo_1.TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;
        trasladoBusiness.getListadoTrasladosCotizacion(idCotizacion).then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT 99 20201214 Obtiene datos de traslado posterior
    getDatosTraslado(request, response) {
        const trasladoBusiness = new catalogo_1.TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;
        const idCotizacionTraslado = Number(request.params.idCotizacionTraslado);
        trasladoBusiness.getDatosTraslado(idCotizacion, idCotizacionTraslado).then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT 99 20210106 Elimina traslados posteriores de MOV antes de haber enviado a BPRO
    eliminaTrasladoPosteriorMov(request, response) {
        const trasladoBusiness = new catalogo_1.TrasladoBusiness();
        const traslado = request.params;
        trasladoBusiness.eliminaTrasladoPosteriorMov(traslado).then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // CHK - 07 ene 2021 Lista traslados mov
    getListarTrasladosPosteriores(request, response) {
        const trasladoBusiness = new catalogo_1.TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;
        trasladoBusiness.getListarTrasladosPosteriores(idCotizacion)
            .then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT 99 20210302 obtiene listado del traslado en modal para consultar/editar traslados POSTAD
    getListadoTrasladoDetallePost(request, response) {
        const trasladoBusiness = new catalogo_1.TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;
        const idCotizacionTraslado = Number(request.params.idCotizacionTraslado);
        trasladoBusiness.getListadoTrasladoDetallePost(idCotizacion, idCotizacionTraslado)
            .then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT 99 20210308 obtiene listado del traslado en modal para editar traslados POSTAD
    getObtenerDatosEdicionTrasladoPost(request, response) {
        const trasladoBusiness = new catalogo_1.TrasladoBusiness();
        const idCotizacion = request.params.idCotizacion;
        const idCotizacionTraslado = Number(request.params.idCotizacionTraslado);
        trasladoBusiness.getObtenerDatosEdicionTrasladoPost(idCotizacion, idCotizacionTraslado)
            .then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT 99 20210308 edicion de traslado posterior
    postEditaTrasladosMovs(request, response) {
        const trasladoBusiness = new catalogo_1.TrasladoBusiness();
        const traslado = request.body;
        console.log('postEditaTrasladosMovs traslado: ');
        console.log(traslado);
        trasladoBusiness.postEditaTrasladosMovs(traslado).then((res) => {
            response.status(200).send(res);
        }, (err) => {
            response.status(500).send(err);
        });
    }
}
exports.TrasladosController = TrasladosController;
//# sourceMappingURL=traslados.controller.js.map