import express = require('express');
import { Validator } from 'express-json-validator-middleware';
import respuesta = require('../../network/response');
import {
    AccesorioBusiness, ClienteBussiness,
    DireccionFlotillasBusiness, EmpresaBusiness, FacturacionBussiness,
    FinancieraBusiness, InventarioUnidadBusiness, IvaBusiness,
    MarcaBusiness, ServicioUnidadBusiness, SucursalBusiness, SyncBusiness, TramiteBusiness,
} from '../business/catalogo';
import { MonedaVentaBusiness, ProveedorBusiness, TipoVentaBusiness } from '../business/catalogo';
import {
    Accesorio, AccesorioNuevo, Cfdi, Cliente, ClienteFilter, ClienteFilterResult, ColorUnidad,
    DireccionFlotillas, Empresa, EncPaqueteAccesorio,
    EncPaqueteServicioUnidad, EncPaqueteTramite, Financiera, InventarioUnidad, Iva,
    Marca, ModeloFilter, MonedaVenta, Proveedor, ProveedorAdicional,
    RelClienteCfdi, RelClienteDireccionFlotillas, ServicioUnidad, Subtramite, Sucursal, TipoVenta, Tramite, UnidadBpro, UnidadMedida, VersionUnidad,
} from '../db/model/catalogo';
import * as postAccesorioNuevo from '../schemas/catalogo/accesorio_nuevo.schema.json';
import * as filtroClienteSchema from '../schemas/catalogo/cliente_filter.schema.json';
import * as postCobrarPrimerTrasladoSchema from '../schemas/catalogo/cobrar_primer_traslado.schema.json';
import * as postCobrarPrimerTrasladoArray from '../schemas/catalogo/cobrar_primer_traslado_array.schema.json';
import * as postDetPaqueteAccesorio from '../schemas/catalogo/det_paquete_accesorio.schema.json';
import * as postDetPaqueteServicioUnidad from '../schemas/catalogo/det_paquete_servicio_unidad.schema.json';
import * as postDetPaqueteTramite from '../schemas/catalogo/det_paquete_tramite.schema.json';
import * as postEncPaqueteAccesorio from '../schemas/catalogo/enc_paquete_accesorio.schema.json';
import * as postEncPaqueteServicioUnidad from '../schemas/catalogo/enc_paquete_servicio_unidad.schema.json';
import * as postEncPaqueteTramite from '../schemas/catalogo/enc_paquete_tramite.schema.json';
import * as postModeloFilter from '../schemas/catalogo/modelo_filter.schema.json';
import * as postClientesCfdi from '../schemas/catalogo/post_rel_cliente_cfdi.schema.json';
import * as postClientesCfdiArray from '../schemas/catalogo/post_rel_cliente_cfdi_array.schema.json';
import * as postClientesDireccionesFlotillas from '../schemas/catalogo/post_rel_cliente_direccion_flotillas.schema.json';
import * as postClientesDireccionesFlotillasArray from '../schemas/catalogo/post_rel_cliente_direccion_flotillas_array.schema.json';
import * as clientesCfdi from '../schemas/catalogo/rel_cliente_cfdi.schema.json';
import * as clientesDireccionesFlotillas from '../schemas/catalogo/rel_cliente_direccion_flotillas.schema.json';

import { SimpleConsoleLogger } from 'typeorm';
import { ModeloUnidad } from '../../src/db/model/catalogo/modelo_unidad.model';
import { Cotizacion } from '../db/model/cotizador/cotizacion.model';
import { BaseController } from './base.controller';
import { IController } from './controller.interface';

export class CatalogoController extends BaseController implements IController {
    basePath = '/catalogo';
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
            `${this.basePath}/cliente/getClientes`,
            validate({ body: filtroClienteSchema }),
            this.getClientes.bind(this),
        );
        this.router.get(
            `${this.basePath}/cliente/get/:idCliente`,
            this.getCliente.bind(this),
        );
        this.router.get(
            `${this.basePath}/cliente/getAllRelDireccionFlotillas`,
            this.getAllRelDireccionFlotillas.bind(this),
        );
        this.router.get(
            `${this.basePath}/cliente/filtrarClientes/:filtro/:tipoPersona`,
            this.filtrarClientes.bind(this),
        );
        const schemaClienteDireccionFlotillasArray = ajv
            .addSchema(clientesDireccionesFlotillas)
            .addSchema(postClientesDireccionesFlotillas)
            .compile(postClientesDireccionesFlotillasArray).schema;
        this.router.post(
            `${this.basePath}/cliente/saveAllRelDireccionFlotillas`,
            validate({ body: schemaClienteDireccionFlotillasArray }),
            this.saveRelsDireccionFlotillas.bind(this),
        );
        this.router.get(
            `${this.basePath}/cliente/getAllRelCfdis/:idUsuario?`,
            this.getAllRelCfdis.bind(this),
        );
        const schemaClienteCfdiArray = ajv
            .addSchema(clientesCfdi)
            .addSchema(postClientesCfdi)
            .compile(postClientesCfdiArray).schema;
        this.router.post(
            `${this.basePath}/cliente/saveAllRelCfdis`,
            validate({ body: schemaClienteCfdiArray }),
            this.saveRelsCfdis.bind(this),
        );
        this.router.get(
            `${this.basePath}/direccionFlotillas/getAll`,
            this.getAllDireccionFlotillas.bind(this),
        );
        this.router.get(
            `${this.basePath}/cfdi/getAll`,
            this.getAllCfdis.bind(this),
        );
        this.router.get(
            `${this.basePath}/sync`,
            this.sync.bind(this),
        );
        this.router.get(
            `${this.basePath}/marca/getMarcas`,
            this.getMarcas.bind(this),
        );

        const postCobrarPrimerTraslado = ajv
            .addSchema(postCobrarPrimerTrasladoSchema)
            .compile(postCobrarPrimerTrasladoArray).schema;
        this.router.post(
            `${this.basePath}/valida/cobrarPrimerTraslado`,
            this.cobrarPrimerTraslado.bind(this),
        );

        this.router.post(
            `${this.basePath}/valida/cobrarPrimerTrasladoCOAL`,
            this.cobrarPrimerTrasladoCOAL.bind(this),
        );

        this.router.get(
            `${this.basePath}/empresa/getEmpresas/:idMarca`,
            this.getEmpresas.bind(this),
        );
        this.router.get(
            `${this.basePath}/financiera/getFinancieras/:idSucursal`,
            this.getFinancieras.bind(this),
        );
        this.router.get(
            `${this.basePath}/sucursal/getSucursales/:idEmpresa`,
            this.getSucursales.bind(this),
        );
        this.router.get(
            `${this.basePath}/inventario/getUnidadesNuevas/:idEmpresa/:idSucursal`,
            this.getInventarioUnidadesNuevas.bind(this),
        );
        this.router.get(
            `${this.basePath}/unidad/getUnidadesBpro/:idEmpresa`,
            this.getUnidadesBpro.bind(this),
        );
        this.router.get(
            `${this.basePath}/unidad/getVersiones/:idEmpresa/:idUnidadBpro`,
            this.getVersiones.bind(this),
        );
        this.router.get(
            `${this.basePath}/unidad/getCostoCatalago/:sucursal/:idCatalogo/:modelo`,
            this.getCostoCatalago.bind(this),
        );
        this.router.get(
            `${this.basePath}/unidad/getColorExterior/:idEmpresa/:idUnidadBpro/:idModelo`,
            this.getColorExterior.bind(this),
        );
        this.router.get(
            `${this.basePath}/unidad/getColorInterior/:idEmpresa/:idUnidadBpro/:idModelo`,
            this.getColorInterior.bind(this),
        );
        this.router.post(
            `${this.basePath}/unidad/getModelos`,
            validate({ body: postModeloFilter }),
            this.getModelos.bind(this),
        );
        this.router.get(
            `${this.basePath}/proveedor/getProveedores/:idSucursal/:idTipoProveedor`,
            this.getProveedores.bind(this),
        );
        this.router.get(
            `${this.basePath}/proveedor/getProveedores/:idSucursal`,
            this.getProveedores.bind(this),
        );
        this.router.get(
            `${this.basePath}/tramite/getTramites/:idMarca/:idSucursal/:idDireccionFlotillas`,
            this.getTramites.bind(this),
        );
        this.router.get(
            `${this.basePath}/tramite/getSubtramites/:idMarca/:idSucursal/:idTramite`,
            this.getSubtramites.bind(this),
        );
        this.router.get(
            `${this.basePath}/tramite/getProveedoresSubtramite/:idMarca/:idSucursal/:idSubtramite`,
            this.getProveedoresSubtramite.bind(this),
        );
        this.router.get(
            `${this.basePath}/accesorio/getAccesorios/:idCotizacion/:idMarca/:idSucursal/:idParte/:Descripcion`,
            this.getAccesorios.bind(this),
        );
        this.router.get(
            `${this.basePath}/accesorio/getAccesoriosNuevos/:idSucursal`,
            this.getAccesoriosNuevos.bind(this),
        );
        this.router.post(
            `${this.basePath}/accesorio/saveAccesorioNuevo`,
            validate({ body: postAccesorioNuevo }),
            this.saveAccesorioNuevo.bind(this),
        );

        // SISCO
        this.router.get(
            `${this.basePath}/accesorio/getAccesoriosSISCO/:idCotizacion`, /////////
            this.getAccesoriosSISCO.bind(this),
        );

        // SISCO - POSTERIORES/ADICIONALES 20210128
        // SISCO Obtiene los accesorios para enviar solicitud a SISCO
        this.router.get(
            `${this.basePath}/accesorio/getAccesoriosSISCOPostAd/:idCotizacion`, /////////
            this.getAccesoriosSISCOPostAd.bind(this),
        );

        // SISCO
        this.router.post(
            `${this.basePath}/accesorio/ActualizaSolicitudCotizacionAccesorio`,
            this.actualizaSolicitudCotizacionAccesorio.bind(this),
        );

        // SISCO escenario 3
        this.router.post(
            `${this.basePath}/accesorio/guardaSolicitudAccesorioNuevo`,
            this.guardaSolicitudAccesorioNuevo.bind(this),
        );

        // SISCO - POSTERIORES/ADICIONALES 20210128
        // SISCO escenario 3
        this.router.post(
            `${this.basePath}/accesorio/guardaSolicitudAccesorioNuevoPostAd`,
            this.guardaSolicitudAccesorioNuevoPostAd.bind(this),
        );

        // SISCO escenario 1
        this.router.post(
            `${this.basePath}/accesorio/guardaSolicitudAccesorio`,
            this.guardaSolicitudAccesorio.bind(this),
        );

        // SISCO - POSTERIORES/ADICIONALES 20210128
        // SISCO escenario 1
        this.router.post(
            `${this.basePath}/accesorio/guardaSolicitudAccesorioPostAd`,
            this.guardaSolicitudAccesorioPostAd.bind(this),
        );

        // SISCO escenario 2
        this.router.post(
            `${this.basePath}/accesorio/guardaSolicitudAccesorioSISCO`,
            this.guardaSolicitudAccesorioSISCO.bind(this),
        );

        // SISCO - POSTERIORES/ADICIONALES 20210128
        // SISCO escenario 2
        this.router.post(
            `${this.basePath}/accesorio/guardaSolicitudAccesorioSISCOPostAd`,
            this.guardaSolicitudAccesorioSISCOPostAd.bind(this),
        );

        // elimina accesorio SISCO
        this.router.post(
            `${this.basePath}/accesorio/eliminaAccesorioSisco`,
            this.eliminaAccesorioSisco.bind(this),
        );
        // SISCO - POSTERIORES/ADICIONALES 20210128
        // elimina accesorio SISCO
        this.router.post(
            `${this.basePath}/accesorio/eliminaAccesorioSiscoPostAd`,
            this.eliminaAccesorioSiscoPostAd.bind(this),
        );

        // OCT 99 20201209 SISCO obtiene datos de acceso a SISCO
        this.router.get(
            `${this.basePath}/accesorio/getFlotillasDatosSISCO`, /////////
            this.getFlotillas_Datos_SISCO.bind(this),
        );

        // guarda respuesta de insertar SOLICITUD en SISCO
        this.router.post(
            `${this.basePath}/accesorio/guardaSISCOSolicitudFlotillas`,
            this.guardaSISCOSolicitudFlotillas.bind(this),
        );

        // CHK - 03 Feb 21k | guarda respuesta de insertar SOLICITUD en SISCO posteriores
        this.router.post(
            `${this.basePath}/accesorio/guardaSISCOSolicitudFlotillasPostAd`,
            this.guardaSISCOSolicitudFlotillasPostAd.bind(this),
        );

        this.router.delete(
            `${this.basePath}/accesorio/:idAccesorioNuevo`,
            this.deleteAccesorioNuevo.bind(this),
        );
        this.router.get(
            `${this.basePath}/accesorio/getAccesorios/:idMarca/:idSucursal`,
            this.getAccesorios.bind(this),
        );
        this.router.get(
            `${this.basePath}/accesorio/getAccesorios/:idCotizacion/:idMarca/:idSucursal`,
            this.getAccesorios.bind(this),
        );
        this.router.get(
            `${this.basePath}/servicioUnidad/getServiciosUnidad/:idSucursal/:catalogo/:anio`,
            this.getServiciosUnidad.bind(this),
        );
        this.router.get(
            `${this.basePath}/paqueteServicioUnidad/getAll/:idSucursal`,
            this.getPaquetesServicioUnidad.bind(this),
        );
        this.router.get(
            `${this.basePath}/paqueteServicioUnidad/getAll/:idSucursal/:catalogo`,
            this.getPaquetesServicioUnidad.bind(this),
        );
        this.router.get(
            `${this.basePath}/paqueteServicioUnidad/getAll/:idSucursal/:catalogo/:anio`,
            this.getPaquetesServicioUnidad.bind(this),
        );
        this.router.delete(
            `${this.basePath}/paqueteServicioUnidad/:idEncPaqueteServicioUnidad`,
            this.deletePaqueteServicioUnidad.bind(this),
        );
        const schemaEncPaqueteServicioUnidad = ajv
            .addSchema(postDetPaqueteServicioUnidad)
            .compile(postEncPaqueteServicioUnidad).schema;
        this.router.post(
            `${this.basePath}/paqueteServicioUnidad/save`,
            validate({ body: schemaEncPaqueteServicioUnidad }),
            this.savePaqueteServicioUnidad.bind(this),
        );
        this.router.get(
            `${this.basePath}/paqueteTramite/getAll/:idSucursal`,
            this.getPaquetesTramite.bind(this),
        );
        this.router.delete(
            `${this.basePath}/paqueteTramite/:idEncPaqueteTramite`,
            this.deletePaqueteTramite.bind(this),
        );
        const schemaEncPaqueteTramite = ajv
            .addSchema(postDetPaqueteTramite)
            .compile(postEncPaqueteTramite).schema;
        this.router.post(
            `${this.basePath}/paqueteTramite/save`,
            validate({ body: schemaEncPaqueteTramite }),
            this.savePaqueteTramite.bind(this),
        );
        this.router.get(
            `${this.basePath}/paqueteAccesorios/getAll/:idSucursal`,
            this.getPaquetesAccesorios.bind(this),
        );
        this.router.delete(
            `${this.basePath}/paqueteAccesorios/:idEncPaqueteAccesorio`,
            this.deletePaqueteAccesorios.bind(this),
        );
        const schemaEncPaqueteAccesorios = ajv
            .addSchema(postDetPaqueteAccesorio)
            .compile(postEncPaqueteAccesorio).schema;
        this.router.post(
            `${this.basePath}/paqueteAccesorios/save`,
            this.savePaqueteAccesorios.bind(this),
        );

        this.router.get(
            `${this.basePath}/getMonedasVenta/:idSucursal`,
            this.getMonedasVenta.bind(this),
        );

        this.router.get(
            `${this.basePath}/getIvas/:idSucursal`,
            this.getIvas.bind(this),
        );

        this.router.get(
            `${this.basePath}/getTiposVenta/:idSucursal/:idDireccionFlotillas`,
            this.getTiposVenta.bind(this),
        );
        // Cambio bonificaciones - EHJ-COAL
        this.router.get(
            `${this.basePath}/unidad/guardaBonificacion/:idCotizacion`,
            this.guardaBonificacion.bind(this),
        );

        this.router.get(
            `${this.basePath}/unidad/getBonificacion/:idSucursal/:idCatalogo/:modelo`,
            this.getBonificacion.bind(this),
        );

        this.router.get(
            `${this.basePath}/marca/getMarcasExternas`,
            this.getMarcasExternas.bind(this),
        );

        this.router.get(
            `${this.basePath}/empresa/getEmpresasExternas/:idMarca`,
            this.getEmpresasExternas.bind(this),
        );

        this.router.get(
            `${this.basePath}/sucursal/getSucursalesExternas/:idEmpresa`,
            this.getSucursalesExternas.bind(this),
        );

        this.router.get(
            `${this.basePath}/financiera/getFinancierasExternas/:idSucursal`,
            this.getFinancierasExternas.bind(this),
        );

        this.router.get(
            `${this.basePath}/unidad/getUnidadesExterno/:idEmpresa`,
            this.getUnidadesExterno.bind(this),
        );

        this.router.get(
            `${this.basePath}/unidad/getVersionesExterno/:idEmpresa/:idUnidadBpro`,
            this.getVersionesExterno.bind(this),
        );

        this.router.post(
            `${this.basePath}/unidad/getModeloExterno`,
            validate({ body: postModeloFilter }),
            this.getModeloExterno.bind(this),
        );

        this.router.get(
            `${this.basePath}/unidad/getCostoCatalagoExterno/:sucursal/:idCatalogo/:modelo`,
            this.getCostoCatalagoExterno.bind(this),
        );

        this.router.get(
            `${this.basePath}/getCatalogoDatosFac/:idFac/:idTipo`,
            this.getCatalogoDatosFac.bind(this),
        );

        this.router.post(
            `${this.basePath}/guardaDatosFacTramite`,
            this.guardaDatosFacTramite.bind(this),
        );

        this.router.post(
            `${this.basePath}/guardaDatosFacTramiteMov`,
            this.guardaDatosFacTramiteMov.bind(this),
        );

        this.router.post(
            `${this.basePath}/guardaDatosFacTraslado`,
            this.guardaDatosFacTraslado.bind(this),
        );

    }

    private sync(request: express.Request, response: express.Response) {
        const syncBusiness = new SyncBusiness();
        syncBusiness.syncClientes().then((insertedRows: number) => {
            response.json({ affectedRows: insertedRows });
        }, (error) => {
            this.errorHandler(response, error);
        });
    }

    private getClientes(request: express.Request, response: express.Response) {
        const filtroCliente = request.body as ClienteFilter;
        const clienteBussiness = new ClienteBussiness();
        clienteBussiness.getClientes(filtroCliente).then(
            (clienteFilterResult: ClienteFilterResult) => {
                response.json(clienteFilterResult);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getCliente(request: express.Request, response: express.Response) {
        const idCliente = Number(request.params.idCliente);
        const clienteBussiness = new ClienteBussiness();
        clienteBussiness.getCliente(idCliente).then(
            (cliente: Cliente) => {
                response.json(cliente);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private filtrarClientes(request: express.Request, response: express.Response) {
        const clienteBussiness = new ClienteBussiness();
        const filtro = request.params.filtro as string;
        const tipoPersona = request.params.tipoPersona as string;
        clienteBussiness.filtrarClientes(filtro, tipoPersona)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private getAllRelDireccionFlotillas(request: express.Request, response: express.Response) {
        const clienteBussiness = new ClienteBussiness();
        clienteBussiness.getAllRelDireccionFlotillas().then(
            (relsDireccionFlotillas: RelClienteDireccionFlotillas[]) => {
                response.json(relsDireccionFlotillas);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private saveRelsDireccionFlotillas(request: express.Request, response: express.Response) {
        const parametroRel = request.body as Array<{ idCliente: number, direccionesFlotillas: RelClienteDireccionFlotillas[] }>;
        const clienteBussiness = new ClienteBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        parametroRel.map((pr) => pr.direccionesFlotillas.map((df) => { df.idUsuarioModificacion = idUsuario; df.fechaModificacion = new Date(); }));
        clienteBussiness.saveRelsDireccionFlotillas(parametroRel, idUsuario).then(
            (savedItems: number) => {
                response.json(savedItems);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getAllRelCfdis(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const clienteBussiness = new ClienteBussiness();
        clienteBussiness.getAllRelCfdis(idUsuario).then(
            (relsCfdis: RelClienteCfdi[]) => {
                response.json(relsCfdis);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private saveRelsCfdis(request: express.Request, response: express.Response) {
        const parametroRel = request.body as Array<{ idCliente: number, cfdis: RelClienteCfdi[] }>;
        const clienteBussiness = new ClienteBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        parametroRel.map((pr) => pr.cfdis.map((df) => { df.idUsuarioModificacion = idUsuario; df.fechaModificacion = new Date(); }));
        clienteBussiness.saveRelsCfdis(parametroRel, idUsuario).then(
            (savedItems: number) => {
                response.json(savedItems);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getAllDireccionFlotillas(request: express.Request, response: express.Response) {
        const direccionFlotillasBusiness = new DireccionFlotillasBusiness();
        direccionFlotillasBusiness.getAllDireccionFlotillas().then(
            (direccionFlotillas: DireccionFlotillas[]) => {
                response.json(direccionFlotillas);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getAllCfdis(request: express.Request, response: express.Response) {
        const facturacionBusiness = new FacturacionBussiness();
        facturacionBusiness.getAllCfdis().then(
            (cfdis: Cfdi[]) => {
                response.json(cfdis);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getMarcas(request: express.Request, response: express.Response) {
        const marcaBusiness = new MarcaBusiness();
        marcaBusiness.getMarcas().then(
            (marcasResult: Marca[]) => {
                response.json(marcasResult);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private cobrarPrimerTraslado(request: express.Request, response: express.Response) {
        const marcaBusiness = new MarcaBusiness();
        const idMarca = request.body.idMarca as string;
        marcaBusiness.cobrarPrimerTraslado(idMarca).then(
            (res) => {
                response.status(200).json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private cobrarPrimerTrasladoCOAL(request: express.Request, response: express.Response) {
        const marcaBusiness = new MarcaBusiness();
        const idMarca = request.body.idMarca as string;
        const idCotizacion = request.body.idCotizacion as string;
        const idGrupoUnidad = request.body.idGrupoUnidad as number;
        const idCotizacionTraslado = request.body.idCotizacionTraslado as number;

        marcaBusiness.cobrarPrimerTrasladoCOAL(idMarca, idCotizacion, idGrupoUnidad, idCotizacionTraslado).then(
            (res) => {
                response.status(200).json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getEmpresas(request: express.Request, response: express.Response) {
        const idMarca = request.params.idMarca as string;
        const empresaBusiness = new EmpresaBusiness();
        empresaBusiness.getEmpresas(idMarca).then(
            (empresas: Empresa[]) => {
                response.json(empresas);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getFinancieras(request: express.Request, response: express.Response) {
        const idSucursal = Number(request.params.idSucursal);
        const financieraBusiness = new FinancieraBusiness();
        financieraBusiness.getFinancieras(idSucursal).then(
            (financieras: Financiera[]) => {
                response.json(financieras);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getSucursales(request: express.Request, response: express.Response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const sucursalBusiness = new SucursalBusiness();
        sucursalBusiness.getSucursales(idEmpresa).then(
            (sucursales: Sucursal[]) => {
                response.json(sucursales);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getInventarioUnidadesNuevas(request: express.Request, response: express.Response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const idSucursal = Number(request.params.idSucursal);
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        inventarioUnidadBusiness.getInventarioUnidadesNuevas(idEmpresa, idSucursal).then(
            (inventarioUnidades: InventarioUnidad[]) => {
                response.json(inventarioUnidades);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getUnidadesBpro(request: express.Request, response: express.Response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        inventarioUnidadBusiness.getUnidadesBpro(idEmpresa).then(
            (unidadesBpro: UnidadBpro[]) => {
                response.json(unidadesBpro);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getVersiones(request: express.Request, response: express.Response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const idUnidadBpro = request.params.idUnidadBpro as string;
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        inventarioUnidadBusiness.getVersionUnidades(idEmpresa, idUnidadBpro).then(
            (versionUnidades: VersionUnidad[]) => {
                response.json(versionUnidades);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getCostoCatalago(request: express.Request, response: express.Response) {
        const sucursal = Number(request.params.sucursal);
        const idCatalogo = request.params.idCatalogo as string;
        const modelo = request.params.modelo as string;
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        inventarioUnidadBusiness.getCostoCatalago(sucursal, idCatalogo, modelo)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((err) => {
                response.status(500).json(err);
            });
    }

    private getColorExterior(request: express.Request, response: express.Response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const idUnidadBpro = request.params.idUnidadBpro;
        const idModelo = Number(request.params.idModelo);
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        inventarioUnidadBusiness.getColorUnidades(false, idEmpresa, idUnidadBpro, idModelo).then(
            (versionColorExterior: ColorUnidad[]) => {
                response.json(versionColorExterior);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getColorInterior(request: express.Request, response: express.Response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const idUnidadBpro = request.params.idUnidadBpro;
        const idModelo = Number(request.params.idModelo);
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        inventarioUnidadBusiness.getColorUnidades(true, idEmpresa, idUnidadBpro, idModelo).then(
            (versionColorExterior: ColorUnidad[]) => {
                response.json(versionColorExterior);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getModelos(request: express.Request, response: express.Response) {
        const modeloFilter = request.body as ModeloFilter;
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        inventarioUnidadBusiness.getModelos(modeloFilter.idEmpresa, modeloFilter.idCatalogo, modeloFilter.anio).then(
            (modelos: ModeloUnidad[]) => {
                response.json(modelos);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getModeloExterno(request: express.Request, response: express.Response) {
        const modeloFilter = request.body as ModeloFilter;
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        inventarioUnidadBusiness.getModeloExterno(modeloFilter.idEmpresa, modeloFilter.idCatalogo, modeloFilter.anio).then(
            (modelos: ModeloUnidad[]) => {
                response.json(modelos);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getProveedores(request: express.Request, response: express.Response) {
        const idSucursal = Number(request.params.idSucursal);
        const idTipoProveedor = (request.params.idTipoProveedor == undefined ? '' : request.params.idTipoProveedor) as string;
        const proveedorBusiness = new ProveedorBusiness();
        proveedorBusiness.getProveedores(idSucursal, idTipoProveedor).then(
            (proveedores: Proveedor[]) => {
                response.json(proveedores);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getTramites(request: express.Request, response: express.Response) {
        const idMarca = request.params.idMarca as string;
        const idSucursal = Number(request.params.idSucursal);
        const idDireccionFlotillas = request.params.idDireccionFlotillas as string;
        const tramiteBusiness = new TramiteBusiness();
        tramiteBusiness.getTramites(idMarca, idSucursal, idDireccionFlotillas).then(
            (tramites: Tramite[]) => {
                response.json(tramites);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getSubtramites(request: express.Request, response: express.Response) {
        const idMarca = request.params.idMarca as string;
        const idSucursal = Number(request.params.idSucursal);
        const idTramite = request.params.idTramite as string;
        const tramiteBusiness = new TramiteBusiness();
        tramiteBusiness.getSubtramites(idMarca, idSucursal, idTramite).then(
            (subtramites: Subtramite[]) => {
                response.json(subtramites);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getProveedoresSubtramite(request: express.Request, response: express.Response) {
        const idMarca = request.params.idMarca as string;
        const idSucursal = Number(request.params.idSucursal);
        const idSubtramite = Number(request.params.idSubtramite);
        const tramiteBusiness = new TramiteBusiness();
        tramiteBusiness.getProveedoresSubtramite(idMarca, idSucursal, idSubtramite).then(
            (proveedoresSubtramite: ProveedorAdicional[]) => {
                response.json(proveedoresSubtramite);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getAccesorios(request: express.Request, response: express.Response) {
        const idCotizacion = (request.params.idCotizacion === undefined ? '' : request.params.idCotizacion) as string;
        const idMarca = request.params.idMarca as string;
        const idSucursal = Number(request.params.idSucursal);
        const idParte = '';
        const Descripcion = '';
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.getAccesorios(idCotizacion, idMarca, idSucursal, idParte, Descripcion).then(
            (accesorios: Accesorio[]) => {
                response.json(accesorios);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getServiciosUnidad(request: express.Request, response: express.Response) {
        const idSucursal = Number(request.params.idSucursal);
        const catalogo = request.params.catalogo as string;
        const anio = request.params.anio as string;
        const servicioUnidadBusiness = new ServicioUnidadBusiness();
        servicioUnidadBusiness.getServiciosUnidad(idSucursal, catalogo, anio).then(
            (serviciosUnidad: ServicioUnidad[]) => {
                response.json(serviciosUnidad);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getPaquetesServicioUnidad(request: express.Request, response: express.Response) {
        const idSucursal = Number(request.params.idSucursal);
        const catalogo = request.params.catalogo as string;
        const anio = request.params.anio as string;
        const servicioUnidadBusiness = new ServicioUnidadBusiness();
        servicioUnidadBusiness.getPaquetesServicioUnidad(idSucursal, catalogo, anio).then(
            (paquetesServicioUnidad: EncPaqueteServicioUnidad[]) => {
                response.json(paquetesServicioUnidad);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }
    private deletePaqueteServicioUnidad(request: express.Request, response: express.Response) {
        const idEncPaqueteServicioUnidad = Number(request.params.idEncPaqueteServicioUnidad);
        const servicioUnidadBusiness = new ServicioUnidadBusiness();
        servicioUnidadBusiness.deletePaqueteServicioUnidad(idEncPaqueteServicioUnidad).then(
            (deletedRows: number) => {
                response.json({ affectedRows: deletedRows });
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }
    private savePaqueteServicioUnidad(request: express.Request, response: express.Response) {
        const encPaqueteServicioUnidad = request.body as EncPaqueteServicioUnidad;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        encPaqueteServicioUnidad.idUsuarioModificacion = idUsuario;
        if (encPaqueteServicioUnidad.serviciosUnidad != undefined) {
            encPaqueteServicioUnidad.serviciosUnidad.map((d) => { d.idUsuarioModificacion = idUsuario; d.fechaModificacion = new Date(); });
        }
        const servicioUnidadBusiness = new ServicioUnidadBusiness();
        servicioUnidadBusiness.savePaqueteServicioUnidad(encPaqueteServicioUnidad).then(
            (res: EncPaqueteServicioUnidad) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getPaquetesTramite(request: express.Request, response: express.Response) {
        const idSucursal = Number(request.params.idSucursal);
        const tramiteBusiness = new TramiteBusiness();
        tramiteBusiness.getPaquetesTramite(idSucursal).then(
            (paquetesTramite: EncPaqueteTramite[]) => {
                response.json(paquetesTramite);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }
    private deletePaqueteTramite(request: express.Request, response: express.Response) {
        const idEncPaqueteTramite = Number(request.params.idEncPaqueteTramite);
        const tramiteBusiness = new TramiteBusiness();
        tramiteBusiness.deletePaqueteTramite(idEncPaqueteTramite).then(
            (deletedRows: number) => {
                response.json({ affectedRows: deletedRows });
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }
    private savePaqueteTramite(request: express.Request, response: express.Response) {
        const encPaqueteTramite = request.body as EncPaqueteTramite;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        encPaqueteTramite.idUsuarioModificacion = idUsuario;
        if (encPaqueteTramite.tramites != undefined) {
            encPaqueteTramite.tramites.map((d) => { d.idUsuarioModificacion = idUsuario; d.fechaModificacion = new Date(); });
        }
        const tramiteBusiness = new TramiteBusiness();
        tramiteBusiness.savePaqueteTramite(encPaqueteTramite).then(
            (res: EncPaqueteTramite) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getAccesoriosNuevos(request: express.Request, response: express.Response) {
        const idSucursal = Number(request.params.idSucursal);
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.getAccesoriosNuevos(idSucursal, idUsuario).then(
            (accesoriosNuevos: AccesorioNuevo[]) => {
                response.json(accesoriosNuevos);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private saveAccesorioNuevo(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : '0');
        const accesorioNuevo = request.body as AccesorioNuevo;
        accesorioNuevo.idUsuario = idUsuario;
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.saveAccesorioNuevo(accesorioNuevo).then(
            (res: AccesorioNuevo) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    // obtiene los accesorios SISCO que se enviaran para crear una solicitud en SISCO
    private getAccesoriosSISCO(request: express.Request, response: express.Response) {
        const idCotizacion = (request.params.idCotizacion === undefined ? '' : request.params.idCotizacion) as string;
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.getAccesoriosSISCO(idCotizacion).then(
            (res: any) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }
    // SISCO - POSTERIORES/ADICIONALES 20210128
    // obtiene los accesorios SISCO que se enviaran para crear una solicitud en SISCO
    private getAccesoriosSISCOPostAd(request: express.Request, response: express.Response) {
        const idCotizacion = (request.params.idCotizacion === undefined ? '' : request.params.idCotizacion) as string;
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.getAccesoriosSISCOPostAd(idCotizacion).then(
            (res: any) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    // SISCO escenario 3
    private guardaSolicitudAccesorioNuevo(request: express.Request, response: express.Response) {
        const solicitudSisco = request.body as any;
        console.log(solicitudSisco);
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.guardaSolicitudAccesorioNuevo(solicitudSisco).then(
            (res: any) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }
    // SISCO - POSTERIORES/ADICIONALES 20210128
    // SISCO escenario 3
    private guardaSolicitudAccesorioNuevoPostAd(request: express.Request, response: express.Response) {
        const solicitudSisco = request.body as any;
        console.log(solicitudSisco);
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.guardaSolicitudAccesorioNuevoPostAd(solicitudSisco).then(
            (res: any) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    // SISCO escenarios 1
    private guardaSolicitudAccesorio(request: express.Request, response: express.Response) {
        const solicitudSisco = request.body as any;
        console.log(solicitudSisco);
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.guardaSolicitudAccesorio(solicitudSisco).then(
            (res: any) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    // SISCO - POSTERIORES/ADICIONALES 20210128
    // SISCO escenarios 1
    private guardaSolicitudAccesorioPostAd(request: express.Request, response: express.Response) {
        const solicitudSisco = request.body as any;
        console.log(solicitudSisco);
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.guardaSolicitudAccesorioPostAd(solicitudSisco).then(
            (res: any) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    // SISCO escenarios 2
    private guardaSolicitudAccesorioSISCO(request: express.Request, response: express.Response) {
        const solicitudSisco = request.body as any;
        console.log(solicitudSisco);
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.guardaSolicitudAccesorioSISCO(solicitudSisco).then(
            (res: any) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    // SISCO - POSTERIORES/ADICIONALES 20210128
    // SISCO escenarios 2
    private guardaSolicitudAccesorioSISCOPostAd(request: express.Request, response: express.Response) {
        const solicitudSisco = request.body as any;
        console.log(solicitudSisco);
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.guardaSolicitudAccesorioSISCOPostAd(solicitudSisco).then(
            (res: any) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    // guarda respuesta de Solicitud en SISCO
    private guardaSISCOSolicitudFlotillas(request: express.Request, response: express.Response) {
        const solicitudSisco = request.body as any;
        console.log(solicitudSisco);
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.guardaSISCOSolicitudFlotillas(solicitudSisco).then(
            (res: any) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

        // CHK - 03 Feb 21k | guarda respuesta de insertar SOLICITUD en SISCO posteriores
    private guardaSISCOSolicitudFlotillasPostAd(request: express.Request, response: express.Response) {
        const solicitudSisco = request.body as any;
        console.log(solicitudSisco);
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.guardaSISCOSolicitudFlotillasPostAd(solicitudSisco).then(
            (res: any) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    // elimina accesorio SISCO
    private eliminaAccesorioSisco(request: express.Request, response: express.Response) {
        const accesorioSisco = request.body as any;
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.eliminaAccesorioSisco(accesorioSisco).then(
            (res: any) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    // SISCO - POSTERIORES/ADICIONALES 20210128
    // elimina accesorio SISCO
    private eliminaAccesorioSiscoPostAd(request: express.Request, response: express.Response) {
        const accesorioSisco = request.body as any;
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.eliminaAccesorioSiscoPostAd(accesorioSisco).then(
            (res: any) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    // SISCO
    private actualizaSolicitudCotizacionAccesorio(request: express.Request, response: express.Response) {
        const cotizacionSisco = request.body as any;

        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.actualizaSolicitudCotizacionAccesorio(cotizacionSisco).then(
            (res: any) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    // OCT 99 obtiene datos de acceso a SISCO
    private getFlotillas_Datos_SISCO(request: express.Request, response: express.Response) {
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.getFlotillas_Datos_SISCO().then(
            (res: any) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private deleteAccesorioNuevo(request: express.Request, response: express.Response) {
        const idAccesorioNuevo = Number(request.params.idAccesorioNuevo);
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.deleteAccesorioNuevo(idAccesorioNuevo).then(
            (deletedRows: number) => {
                response.json({ affectedRows: deletedRows });
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getPaquetesAccesorios(request: express.Request, response: express.Response) {
        const idSucursal = Number(request.params.idSucursal);
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.getPaquetesAccesorio(idSucursal).then(
            (paquetesAccesorio: EncPaqueteAccesorio[]) => {
                response.json(paquetesAccesorio);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }
    private deletePaqueteAccesorios(request: express.Request, response: express.Response) {
        const idEncPaqueteAccesorio = Number(request.params.idEncPaqueteAccesorio);
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.deletePaqueteAccesorio(idEncPaqueteAccesorio).then(
            (deletedRows: number) => {
                response.json({ affectedRows: deletedRows });
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }
    private savePaqueteAccesorios(request: express.Request, response: express.Response) {
        const encPaqueteAccesorio = request.body as EncPaqueteAccesorio;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        if (encPaqueteAccesorio.accesorios != undefined) {
            encPaqueteAccesorio.accesorios.map((d) => { d.idUsuarioModificacion = idUsuario; d.fechaModificacion = new Date(); });
        }
        encPaqueteAccesorio.idUsuarioModificacion = idUsuario;
        const accesorioBusiness = new AccesorioBusiness();
        accesorioBusiness.savePaqueteAccesorio(encPaqueteAccesorio).then(
            (res: EncPaqueteAccesorio) => {
                response.json(res);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getMonedasVenta(request: express.Request, response: express.Response) {
        const idSucursal = Number(request.params.idSucursal == undefined ? '0' : request.params.idSucursal);
        const monedaVentaBusiness = new MonedaVentaBusiness();
        monedaVentaBusiness.getMonedasVenta(idSucursal).then(
            (res: MonedaVenta[]) => {
                response.status(200).json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getIvas(request: express.Request, response: express.Response) {
        const idSucursal = Number(request.params.idSucursal == undefined ? '0' : request.params.idSucursal);
        const ivaBusiness = new IvaBusiness();
        ivaBusiness.getIvas(idSucursal).then(
            (res: Iva[]) => {
                response.status(200).json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getTiposVenta(request: express.Request, response: express.Response) {
        const idSucursal = Number(request.params.idSucursal == undefined ? '0' : request.params.idSucursal);
        const idDireccionFlotillas = request.params.idDireccionFlotillas == undefined ? '' : request.params.idDireccionFlotillas;
        const tipoVentaBusiness = new TipoVentaBusiness();
        tipoVentaBusiness.getTiposVentas(idSucursal, idDireccionFlotillas).then(
            (res: TipoVenta[]) => {
                response.status(200).json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getBonificacion(request: express.Request, response: express.Response) {
        const sucursal = request.params.idSucursal as string;
        const idCatalogo = request.params.idCatalogo as string;
        const modelo = request.params.modelo as string;
        const BonificacionBusiness = new InventarioUnidadBusiness();
        console.log(sucursal);
        console.log(idCatalogo);
        console.log(modelo);
        BonificacionBusiness.getBonificacion(sucursal, idCatalogo, modelo)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((err) => {
                respuesta.error(request, response, 'Error al Obtener la Bonificación', 500, err);
                // response.status(500).json(err);
            });
    }
  // Cambio bonificaciones - EHJ-COAL
    private guardaBonificacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const BonificacionBusiness = new InventarioUnidadBusiness();
        console.log(idCotizacion);
        BonificacionBusiness.guardaBonificacion(idCotizacion)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error al procesar la Bonificación`, 500, error);
                // response.status(500).json(error);
            });
    }

    private getMarcasExternas(request: express.Request, response: express.Response) {
        const marcaBusiness = new MarcaBusiness();
        marcaBusiness.getMarcasExternas().then(
            (marcasResult: Marca[]) => {
                response.json(marcasResult);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getEmpresasExternas(request: express.Request, response: express.Response) {
        const idMarca = request.params.idMarca as string;
        const empresaBusiness = new EmpresaBusiness();
        empresaBusiness.getEmpresasExternas(idMarca).then(
            (empresas: Empresa[]) => {
                response.json(empresas);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getSucursalesExternas(request: express.Request, response: express.Response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const sucursalBusiness = new SucursalBusiness();
        sucursalBusiness.getSucursalesExternas(idEmpresa).then(
            (sucursales: Sucursal[]) => {
                response.json(sucursales);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getFinancierasExternas(request: express.Request, response: express.Response) {
        const idSucursal = Number(request.params.idSucursal);
        const financieraBusiness = new FinancieraBusiness();
        financieraBusiness.getFinancierasExternas(idSucursal).then(
            (financieras: Financiera[]) => {
                response.json(financieras);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getUnidadesExterno(request: express.Request, response: express.Response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        inventarioUnidadBusiness.getUnidadesExterno(idEmpresa).then(
            (unidadesBpro: UnidadBpro[]) => {
                response.json(unidadesBpro);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getVersionesExterno(request: express.Request, response: express.Response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const idUnidadBpro = request.params.idUnidadBpro as string;
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        inventarioUnidadBusiness.getVersionUnidadesExterno(idEmpresa, idUnidadBpro).then(
            (versionUnidades: VersionUnidad[]) => {
                response.json(versionUnidades);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private getCostoCatalagoExterno(request: express.Request, response: express.Response) {
        const sucursal = Number(request.params.sucursal);
        const idCatalogo = request.params.idCatalogo as string;
        const modelo = request.params.modelo as string;
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        inventarioUnidadBusiness.getCostoCatalagoExterno(sucursal, idCatalogo, modelo)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((err) => {
                response.status(500).json(err);
            });
    }

    private getCatalogoDatosFac(request: express.Request, response: express.Response) {
        const idFac = request.params.idFac as string;
        const idTipo = request.params.idTipo as string;

        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        inventarioUnidadBusiness.getCatalogoDatosFac(idFac, idTipo)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((err) => {
                response.status(500).json(err);
            });
    }

    private guardaDatosFacTramite(request: express.Request, response: express.Response) {
        const idCotizacion = request.body[0].idCotizacion as string;
        const idGrupoUnidad = Number(request.body[0].idGrupoUnidad);
        const idDetalleUnidad = Number(request.body[0].idDetalleUnidad);
        const idTramite = request.body[0].idTramite as string;
        const idSubtramite = request.body[0].idSubtramite as string;
        const precio = Number(request.body[0].precio);
        const datosFac = request.body[0].datosFac as string;
        const idUsuario = Number((request.headers.idUsuario) ? request.headers.idusuario : 0);

        const inventarioUnidadBusiness = new InventarioUnidadBusiness();

        inventarioUnidadBusiness.guardaDatosFacTramite(idCotizacion, idGrupoUnidad, idDetalleUnidad, idTramite, idSubtramite, precio, datosFac, idUsuario)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((err) => {
                response.status(500).json(err);
            });
    }

    private guardaDatosFacTramiteMov(request: express.Request, response: express.Response) {
        const idCotizacion = request.body[0].idCotizacion as string;
        const idGrupoUnidad = Number(request.body[0].idGrupoUnidad);
        const idDetalleUnidad = Number(request.body[0].idDetalleUnidad);
        const idTramite = request.body[0].idTramite as string;
        const idSubtramite = request.body[0].idSubtramite as string;
        const precio = Number(request.body[0].precio);
        const datosFac = request.body[0].datosFac as string;
        const idUsuario = Number((request.headers.idUsuario) ? request.headers.idusuario : 0);

        const inventarioUnidadBusiness = new InventarioUnidadBusiness();

        inventarioUnidadBusiness.guardaDatosFacTramiteMov(idCotizacion, idGrupoUnidad, idDetalleUnidad, idTramite, idSubtramite, precio, datosFac, idUsuario)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((err) => {
                response.status(500).json(err);
            });
    }

    private guardaDatosFacTraslado(request: express.Request, response: express.Response) {
        const idCotizacionTraslado = Number(request.body[0].idCotizacionTraslado);
        const idCotizacion = request.body[0].idCotizacion as string;
        const idGrupoUnidad = Number(request.body[0].idGrupoUnidad);
        const idTraslado = Number(request.body[0].idTraslado);
        const datosFac = request.body[0].datosFac as string;
        const idUsuario = Number((request.headers.idUsuario) ? request.headers.idusuario : 0);

        const inventarioUnidadBusiness = new InventarioUnidadBusiness();

        inventarioUnidadBusiness.guardaDatosFacTraslado(idCotizacionTraslado, idCotizacion, idGrupoUnidad, idTraslado, datosFac, idUsuario)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((err) => {
                response.status(500).json(err);
            });
    }

}
