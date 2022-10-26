import express = require('express');

import jsontoxml from 'jsontoxml';
import { SolicitudBussiness } from '../business/solicitud';
import { BaseController } from './base.controller';
import { IController } from './controller.interface';

export class SolicitudController extends BaseController implements IController {
    basePath = '/solicitud';
    router = express.Router();

    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        // :::: GET ::::::::
        this.router.get(
            `${this.basePath}/getSolicitudes`, this.getSolicitudes.bind(this),
        );
        this.router.get(
            `${this.basePath}/getSolicitudCotizacionVehiculo`, this.getSolicitudCotizacionVehiculo.bind(this),
        );
        this.router.get(
            `${this.basePath}/getEstatusPedidoPlanta`, this.getEstatusPedidoPlanta.bind(this),
        );
        this.router.get(
            `${this.basePath}/getGrupoPedidoEntrega`, this.getGrupoPedidoEntrega.bind(this),
        );
        this.router.get(
            `${this.basePath}/getUnidadesDisponibles`, this.getUnidadesDisponibles.bind(this),
        );
        this.router.get(
            `${this.basePath}/getGrupoDetalleUnidad`, this.getGrupoDetalleUnidad.bind(this),
        );
        this.router.get(
            `${this.basePath}/getGestorSolicitudIndicadores`, this.getGestorSolicitudIndicadores.bind(this),
        );
        this.router.get(
            `${this.basePath}/getReasignacion`, this.getReasignacion.bind(this),
        );
        this.router.get(
            `${this.basePath}/getReasignacionDetalle`, this.getReasignacionDetalle.bind(this),
        );
        this.router.get(
            `${this.basePath}/getReasignacionDetalleSeleccion`, this.getReasignacionDetalleSeleccion.bind(this),
        );
        this.router.get(
            `${this.basePath}/getEstatusSolicitudCotizacion`, this.getEstatusSolicitudCotizacion.bind(this),
        );
        this.router.get(
            `${this.basePath}/getReasignacionCombosOrigen`, this.getReasignacionCombosOrigen.bind(this),
        );
        this.router.get(
            `${this.basePath}/getReasignacionCombosDestino`, this.getReasignacionCombosDestino.bind(this),
        );
        // :::: POST ::::::::
        this.router.post(
            `${this.basePath}/insReasignacion`, this.insReasignacion.bind(this),
        );
        this.router.post(
            `${this.basePath}/insReasignacionCreaGrupo`, this.insReasignacionCreaGrupo.bind(this),
        );
        this.router.post(
            `${this.basePath}/insertSolicitud`, this.insertSolicitud.bind(this),
        );
        this.router.post(
            `${this.basePath}/insertGrupoPedido`, this.insertGrupoPedido.bind(this),
        );
        this.router.post(
            `${this.basePath}/insertGrupoPedidoEntrega`, this.insertGrupoPedidoEntrega.bind(this),
        );
        this.router.post(
            `${this.basePath}/insertSolicitudGrupo`, this.insertSolicitudGrupo.bind(this),
        );
        this.router.post(
            `${this.basePath}/deleteSolicitudGrupo`, this.deleteSolicitudGrupo.bind(this),
        );
        this.router.post(
            `${this.basePath}/deleteDetalleUnidad`, this.deleteDetalleUnidad.bind(this),
        );
        this.router.post(
            `${this.basePath}/deleteSolicitud`, this.deleteSolicitud.bind(this),
        );
        this.router.post(
            `${this.basePath}/deleteGrupoPedidoEntrega`, this.deleteGrupoPedidoEntrega.bind(this),
        );
        this.router.post(
            `${this.basePath}/insertSolicitudDetalleUnidad`, this.insertSolicitudDetalleUnidad.bind(this),
        );
        this.router.post(
            `${this.basePath}/insertSolicitudDetalleUnidadMasiva`, this.insertSolicitudDetalleUnidadMasiva.bind(this),
        );
        this.router.post(
            `${this.basePath}/updateDetalleUnidadToAsignado`, this.updateDetalleUnidadToAsignado.bind(this),
        );
        this.router.post(
            `${this.basePath}/updateSolicitud`, this.updateSolicitud.bind(this),
        );
        this.router.post(
            `${this.basePath}/generarOrdenDeCompra`, this.generarOrdenDeCompra.bind(this),
        );
        this.router.post(
            `${this.basePath}/generaCotizacionFlotillas`, this.generaCotizacionFlotillas.bind(this),
        );
        this.router.post(
            `${this.basePath}/updSolicitudGrupoPedido`, this.updSolicitudGrupoPedido.bind(this),
        );
        this.router.get(
            `${this.basePath}/getOrigenSolicitud`, this.getOrigenSolicitud.bind(this),
        );
        this.router.post(
            `${this.basePath}/updSolicitudEstatusUnidad`, this.updSolicitudEstatusUnidad.bind(this),
        );
        this.router.get(
            `${this.basePath}/getEstatusUnidad`, this.getEstatusUnidad.bind(this),
        );
        this.router.get(
            `${this.basePath}/getEntregas`, this.getEntregas.bind(this),
        );
        this.router.get(
            `${this.basePath}/getUbicacionUnidad`, this.getUbicacionUnidad.bind(this),
        );
        this.router.post(
            `${this.basePath}/updSolicitudUbicacionUnidad`, this.updSolicitudUbicacionUnidad.bind(this),
        );
    }

    private getEstatusPedidoPlanta(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getEstatusPedidoPlanta().then(
            (solicitudes: any[]) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getGrupoPedidoEntrega(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getGrupoPedidoEntrega(request.query).then(
            (solicitudes: any[]) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getUnidadesDisponibles(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getUnidadesDisponibles(request.query).then(
            (solicitudes: any[]) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getSolicitudes(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getAllSolicitudes().then(
            (solicitudes: any[]) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getReasignacion(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getReasignacion().then(
            (solicitudes: any[]) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getReasignacionDetalle(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getReasignacionDetalle(request.query).then(
            (solicitudes: any[]) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getReasignacionDetalleSeleccion(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getReasignacionDetalleSeleccion(request.query).then(
            (solicitudes: any[]) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getReasignacionCombosOrigen(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getReasignacionCombosOrigen(request.query).then(
            (solicitudes: any[]) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getEstatusSolicitudCotizacion(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getEstatusSolicitudCotizacion(request.query).then((solicitudes: any[]) => {
            response.status(200).send(solicitudes);
        }, (error) => {
            response.status(500).send(error);
        },
        );

    }

    private getReasignacionCombosDestino(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getReasignacionCombosDestino(request.query).then(
            (solicitudes: any[]) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

     private insReasignacion(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.insReasignacion(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private insReasignacionCreaGrupo(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.insReasignacionCreaGrupo(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getSolicitudCotizacionVehiculo(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getSolicitudCotizacionVehiculo(request.query).then(
            (solicitudes: any[]) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getGrupoDetalleUnidad(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getGrupoDetalleUnidad(request.query).then(
            (solicitudes: any[]) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getGestorSolicitudIndicadores(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getGestorSolicitudIndicadores(request.query).then(
            (solicitudes: any) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private insertSolicitud(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        solicitudBussines.insertSolicitud(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private insertGrupoPedido(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;

        solicitudBussines.insertGrupoPedido(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private insertGrupoPedidoEntrega(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;

        solicitudBussines.insertGrupoPedidoEntrega(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private insertSolicitudGrupo(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;

        solicitudBussines.insertSolicitudGrupo(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private insertSolicitudDetalleUnidad(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;

        solicitudBussines.insertSolicitudDetalleUnidad(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private insertSolicitudDetalleUnidadMasiva(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;

        const vines = {
            vines: data.vines,
        };
        const xml = jsontoxml(
            vines,
        );
        data.vines = xml;
        solicitudBussines.insertSolicitudDetalleUnidadMasiva(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private updateDetalleUnidadToAsignado(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;
        const unidades = {
            unidades: data.unidades,
        };
        const xml = jsontoxml(
            unidades,
        );
        data.unidades = xml;

        solicitudBussines.updateDetalleUnidadToAsignado(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private updateSolicitud(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;

        solicitudBussines.updateSolicitud(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private deleteSolicitudGrupo(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;

        solicitudBussines.deleteSolicitudGrupo(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private deleteSolicitud(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;

        solicitudBussines.deleteSolicitud(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private deleteGrupoPedidoEntrega(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;

        solicitudBussines.deleteGrupoPedidoEntrega(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private deleteDetalleUnidad(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;

        solicitudBussines.deleteDetalleUnidad(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private generarOrdenDeCompra(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;

        solicitudBussines.generarOrdenDeCompra(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private generaCotizacionFlotillas(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.idUsuario = idUsuario;

        solicitudBussines.generaCotizacionFlotillas(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private updSolicitudGrupoPedido(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();

        const data = request.body;

        const vines = {
            vines: data.vines,
        };
        const xml = jsontoxml(
            vines,
        );
        data.vines = xml;

        solicitudBussines.updSolicitudGrupoPedido(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getOrigenSolicitud(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getOrigenSolicitud(request.query).then(
            (solicitudes: any[]) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private updSolicitudEstatusUnidad(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;

        solicitudBussines.updSolicitudEstatusUnidad(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getEstatusUnidad(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getEstatusUnidad(request.query).then(
            (solicitudes: any[]) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getEntregas(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getEntregas(request.query).then(
            (solicitudes: any[]) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getUbicacionUnidad(request: express.Request, response: express.Response) {
        const cotizacionBussines = new SolicitudBussiness();
        cotizacionBussines.getUbicacionUnidad(request.query).then(
            (solicitudes: any[]) => {
                response.status(200).send(solicitudes);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private updSolicitudUbicacionUnidad(request: express.Request, response: express.Response) {
        const solicitudBussines = new SolicitudBussiness();
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;

        solicitudBussines.updSolicitudUbicacionUnidad(data).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

}
