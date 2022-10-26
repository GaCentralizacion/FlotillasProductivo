"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const jsontoxml_1 = __importDefault(require("jsontoxml"));
const solicitud_1 = require("../business/solicitud");
const base_controller_1 = require("./base.controller");
class SolicitudController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.basePath = '/solicitud';
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        // :::: GET ::::::::
        this.router.get(`${this.basePath}/getSolicitudes`, this.getSolicitudes.bind(this));
        this.router.get(`${this.basePath}/getSolicitudCotizacionVehiculo`, this.getSolicitudCotizacionVehiculo.bind(this));
        this.router.get(`${this.basePath}/getEstatusPedidoPlanta`, this.getEstatusPedidoPlanta.bind(this));
        this.router.get(`${this.basePath}/getGrupoPedidoEntrega`, this.getGrupoPedidoEntrega.bind(this));
        this.router.get(`${this.basePath}/getUnidadesDisponibles`, this.getUnidadesDisponibles.bind(this));
        this.router.get(`${this.basePath}/getGrupoDetalleUnidad`, this.getGrupoDetalleUnidad.bind(this));
        this.router.get(`${this.basePath}/getGestorSolicitudIndicadores`, this.getGestorSolicitudIndicadores.bind(this));
        this.router.get(`${this.basePath}/getReasignacion`, this.getReasignacion.bind(this));
        this.router.get(`${this.basePath}/getReasignacionDetalle`, this.getReasignacionDetalle.bind(this));
        this.router.get(`${this.basePath}/getReasignacionDetalleSeleccion`, this.getReasignacionDetalleSeleccion.bind(this));
        this.router.get(`${this.basePath}/getEstatusSolicitudCotizacion`, this.getEstatusSolicitudCotizacion.bind(this));
        this.router.get(`${this.basePath}/getReasignacionCombosOrigen`, this.getReasignacionCombosOrigen.bind(this));
        this.router.get(`${this.basePath}/getReasignacionCombosDestino`, this.getReasignacionCombosDestino.bind(this));
        // :::: POST ::::::::
        this.router.post(`${this.basePath}/insReasignacion`, this.insReasignacion.bind(this));
        this.router.post(`${this.basePath}/insReasignacionCreaGrupo`, this.insReasignacionCreaGrupo.bind(this));
        this.router.post(`${this.basePath}/insertSolicitud`, this.insertSolicitud.bind(this));
        this.router.post(`${this.basePath}/insertGrupoPedido`, this.insertGrupoPedido.bind(this));
        this.router.post(`${this.basePath}/insertGrupoPedidoEntrega`, this.insertGrupoPedidoEntrega.bind(this));
        this.router.post(`${this.basePath}/insertSolicitudGrupo`, this.insertSolicitudGrupo.bind(this));
        this.router.post(`${this.basePath}/deleteSolicitudGrupo`, this.deleteSolicitudGrupo.bind(this));
        this.router.post(`${this.basePath}/deleteDetalleUnidad`, this.deleteDetalleUnidad.bind(this));
        this.router.post(`${this.basePath}/deleteSolicitud`, this.deleteSolicitud.bind(this));
        this.router.post(`${this.basePath}/deleteGrupoPedidoEntrega`, this.deleteGrupoPedidoEntrega.bind(this));
        this.router.post(`${this.basePath}/insertSolicitudDetalleUnidad`, this.insertSolicitudDetalleUnidad.bind(this));
        this.router.post(`${this.basePath}/insertSolicitudDetalleUnidadMasiva`, this.insertSolicitudDetalleUnidadMasiva.bind(this));
        this.router.post(`${this.basePath}/updateDetalleUnidadToAsignado`, this.updateDetalleUnidadToAsignado.bind(this));
        this.router.post(`${this.basePath}/updateSolicitud`, this.updateSolicitud.bind(this));
        this.router.post(`${this.basePath}/generarOrdenDeCompra`, this.generarOrdenDeCompra.bind(this));
        this.router.post(`${this.basePath}/generaCotizacionFlotillas`, this.generaCotizacionFlotillas.bind(this));
        this.router.post(`${this.basePath}/updSolicitudGrupoPedido`, this.updSolicitudGrupoPedido.bind(this));
        this.router.get(`${this.basePath}/getOrigenSolicitud`, this.getOrigenSolicitud.bind(this));
        this.router.post(`${this.basePath}/updSolicitudEstatusUnidad`, this.updSolicitudEstatusUnidad.bind(this));
        this.router.get(`${this.basePath}/getEstatusUnidad`, this.getEstatusUnidad.bind(this));
        this.router.get(`${this.basePath}/getEntregas`, this.getEntregas.bind(this));
        this.router.get(`${this.basePath}/getUbicacionUnidad`, this.getUbicacionUnidad.bind(this));
        this.router.post(`${this.basePath}/updSolicitudUbicacionUnidad`, this.updSolicitudUbicacionUnidad.bind(this));
    }
    getEstatusPedidoPlanta(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getEstatusPedidoPlanta().then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getGrupoPedidoEntrega(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getGrupoPedidoEntrega(request.query).then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getUnidadesDisponibles(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getUnidadesDisponibles(request.query).then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getSolicitudes(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getAllSolicitudes().then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getReasignacion(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getReasignacion().then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getReasignacionDetalle(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getReasignacionDetalle(request.query).then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getReasignacionDetalleSeleccion(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getReasignacionDetalleSeleccion(request.query).then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getReasignacionCombosOrigen(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getReasignacionCombosOrigen(request.query).then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getEstatusSolicitudCotizacion(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getEstatusSolicitudCotizacion(request.query).then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getReasignacionCombosDestino(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getReasignacionCombosDestino(request.query).then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    insReasignacion(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.insReasignacion(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    insReasignacionCreaGrupo(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.insReasignacionCreaGrupo(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getSolicitudCotizacionVehiculo(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getSolicitudCotizacionVehiculo(request.query).then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getGrupoDetalleUnidad(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getGrupoDetalleUnidad(request.query).then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getGestorSolicitudIndicadores(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getGestorSolicitudIndicadores(request.query).then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    insertSolicitud(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.insertSolicitud(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    insertGrupoPedido(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.insertGrupoPedido(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    insertGrupoPedidoEntrega(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.insertGrupoPedidoEntrega(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    insertSolicitudGrupo(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.insertSolicitudGrupo(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    insertSolicitudDetalleUnidad(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.insertSolicitudDetalleUnidad(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    insertSolicitudDetalleUnidadMasiva(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        const vines = {
            vines: data.vines,
        };
        const xml = jsontoxml_1.default(vines);
        data.vines = xml;
        solicitudBussines.insertSolicitudDetalleUnidadMasiva(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    updateDetalleUnidadToAsignado(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        const unidades = {
            unidades: data.unidades,
        };
        const xml = jsontoxml_1.default(unidades);
        data.unidades = xml;
        solicitudBussines.updateDetalleUnidadToAsignado(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    updateSolicitud(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.updateSolicitud(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    deleteSolicitudGrupo(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.deleteSolicitudGrupo(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    deleteSolicitud(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.deleteSolicitud(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    deleteGrupoPedidoEntrega(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.deleteGrupoPedidoEntrega(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    deleteDetalleUnidad(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.deleteDetalleUnidad(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    generarOrdenDeCompra(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.generarOrdenDeCompra(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    generaCotizacionFlotillas(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.generaCotizacionFlotillas(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    updSolicitudGrupoPedido(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        const data = request.body;
        const vines = {
            vines: data.vines,
        };
        const xml = jsontoxml_1.default(vines);
        data.vines = xml;
        solicitudBussines.updSolicitudGrupoPedido(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getOrigenSolicitud(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getOrigenSolicitud(request.query).then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    updSolicitudEstatusUnidad(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        solicitudBussines.updSolicitudEstatusUnidad(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getEstatusUnidad(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getEstatusUnidad(request.query).then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getEntregas(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getEntregas(request.query).then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getUbicacionUnidad(request, response) {
        const cotizacionBussines = new solicitud_1.SolicitudBussiness();
        cotizacionBussines.getUbicacionUnidad(request.query).then((solicitudes) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    updSolicitudUbicacionUnidad(request, response) {
        const solicitudBussines = new solicitud_1.SolicitudBussiness();
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        solicitudBussines.updSolicitudUbicacionUnidad(data).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
}
exports.SolicitudController = SolicitudController;
//# sourceMappingURL=solicitud.controller.js.map