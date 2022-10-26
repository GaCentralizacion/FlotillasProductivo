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
const respuesta = require("../../network/response");
const catalogo_1 = require("../business/catalogo");
const catalogo_2 = require("../business/catalogo");
const postAccesorioNuevo = __importStar(require("../schemas/catalogo/accesorio_nuevo.schema.json"));
const filtroClienteSchema = __importStar(require("../schemas/catalogo/cliente_filter.schema.json"));
const postCobrarPrimerTrasladoSchema = __importStar(require("../schemas/catalogo/cobrar_primer_traslado.schema.json"));
const postCobrarPrimerTrasladoArray = __importStar(require("../schemas/catalogo/cobrar_primer_traslado_array.schema.json"));
const postDetPaqueteAccesorio = __importStar(require("../schemas/catalogo/det_paquete_accesorio.schema.json"));
const postDetPaqueteServicioUnidad = __importStar(require("../schemas/catalogo/det_paquete_servicio_unidad.schema.json"));
const postDetPaqueteTramite = __importStar(require("../schemas/catalogo/det_paquete_tramite.schema.json"));
const postEncPaqueteAccesorio = __importStar(require("../schemas/catalogo/enc_paquete_accesorio.schema.json"));
const postEncPaqueteServicioUnidad = __importStar(require("../schemas/catalogo/enc_paquete_servicio_unidad.schema.json"));
const postEncPaqueteTramite = __importStar(require("../schemas/catalogo/enc_paquete_tramite.schema.json"));
const postModeloFilter = __importStar(require("../schemas/catalogo/modelo_filter.schema.json"));
const postClientesCfdi = __importStar(require("../schemas/catalogo/post_rel_cliente_cfdi.schema.json"));
const postClientesCfdiArray = __importStar(require("../schemas/catalogo/post_rel_cliente_cfdi_array.schema.json"));
const postClientesDireccionesFlotillas = __importStar(require("../schemas/catalogo/post_rel_cliente_direccion_flotillas.schema.json"));
const postClientesDireccionesFlotillasArray = __importStar(require("../schemas/catalogo/post_rel_cliente_direccion_flotillas_array.schema.json"));
const clientesCfdi = __importStar(require("../schemas/catalogo/rel_cliente_cfdi.schema.json"));
const clientesDireccionesFlotillas = __importStar(require("../schemas/catalogo/rel_cliente_direccion_flotillas.schema.json"));
const base_controller_1 = require("./base.controller");
class CatalogoController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.basePath = '/catalogo';
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        const validator = new express_json_validator_middleware_1.Validator({ allErrors: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        this.router.post(`${this.basePath}/cliente/getClientes`, validate({ body: filtroClienteSchema }), this.getClientes.bind(this));
        this.router.get(`${this.basePath}/cliente/get/:idCliente`, this.getCliente.bind(this));
        this.router.get(`${this.basePath}/cliente/getAllRelDireccionFlotillas`, this.getAllRelDireccionFlotillas.bind(this));
        this.router.get(`${this.basePath}/cliente/filtrarClientes/:filtro/:tipoPersona`, this.filtrarClientes.bind(this));
        const schemaClienteDireccionFlotillasArray = ajv
            .addSchema(clientesDireccionesFlotillas)
            .addSchema(postClientesDireccionesFlotillas)
            .compile(postClientesDireccionesFlotillasArray).schema;
        this.router.post(`${this.basePath}/cliente/saveAllRelDireccionFlotillas`, validate({ body: schemaClienteDireccionFlotillasArray }), this.saveRelsDireccionFlotillas.bind(this));
        this.router.get(`${this.basePath}/cliente/getAllRelCfdis/:idUsuario?`, this.getAllRelCfdis.bind(this));
        const schemaClienteCfdiArray = ajv
            .addSchema(clientesCfdi)
            .addSchema(postClientesCfdi)
            .compile(postClientesCfdiArray).schema;
        this.router.post(`${this.basePath}/cliente/saveAllRelCfdis`, validate({ body: schemaClienteCfdiArray }), this.saveRelsCfdis.bind(this));
        this.router.get(`${this.basePath}/direccionFlotillas/getAll`, this.getAllDireccionFlotillas.bind(this));
        this.router.get(`${this.basePath}/cfdi/getAll`, this.getAllCfdis.bind(this));
        this.router.get(`${this.basePath}/sync`, this.sync.bind(this));
        this.router.get(`${this.basePath}/marca/getMarcas`, this.getMarcas.bind(this));
        const postCobrarPrimerTraslado = ajv
            .addSchema(postCobrarPrimerTrasladoSchema)
            .compile(postCobrarPrimerTrasladoArray).schema;
        this.router.post(`${this.basePath}/valida/cobrarPrimerTraslado`, this.cobrarPrimerTraslado.bind(this));
        this.router.post(`${this.basePath}/valida/cobrarPrimerTrasladoCOAL`, this.cobrarPrimerTrasladoCOAL.bind(this));
        this.router.get(`${this.basePath}/empresa/getEmpresas/:idMarca`, this.getEmpresas.bind(this));
        this.router.get(`${this.basePath}/financiera/getFinancieras/:idSucursal`, this.getFinancieras.bind(this));
        this.router.get(`${this.basePath}/sucursal/getSucursales/:idEmpresa`, this.getSucursales.bind(this));
        this.router.get(`${this.basePath}/inventario/getUnidadesNuevas/:idEmpresa/:idSucursal`, this.getInventarioUnidadesNuevas.bind(this));
        this.router.get(`${this.basePath}/unidad/getUnidadesBpro/:idEmpresa`, this.getUnidadesBpro.bind(this));
        this.router.get(`${this.basePath}/unidad/getVersiones/:idEmpresa/:idUnidadBpro`, this.getVersiones.bind(this));
        this.router.get(`${this.basePath}/unidad/getCostoCatalago/:sucursal/:idCatalogo/:modelo`, this.getCostoCatalago.bind(this));
        this.router.get(`${this.basePath}/unidad/getColorExterior/:idEmpresa/:idUnidadBpro/:idModelo`, this.getColorExterior.bind(this));
        this.router.get(`${this.basePath}/unidad/getColorInterior/:idEmpresa/:idUnidadBpro/:idModelo`, this.getColorInterior.bind(this));
        this.router.post(`${this.basePath}/unidad/getModelos`, validate({ body: postModeloFilter }), this.getModelos.bind(this));
        this.router.get(`${this.basePath}/proveedor/getProveedores/:idSucursal/:idTipoProveedor`, this.getProveedores.bind(this));
        this.router.get(`${this.basePath}/proveedor/getProveedores/:idSucursal`, this.getProveedores.bind(this));
        this.router.get(`${this.basePath}/tramite/getTramites/:idMarca/:idSucursal/:idDireccionFlotillas`, this.getTramites.bind(this));
        this.router.get(`${this.basePath}/tramite/getSubtramites/:idMarca/:idSucursal/:idTramite`, this.getSubtramites.bind(this));
        this.router.get(`${this.basePath}/tramite/getProveedoresSubtramite/:idMarca/:idSucursal/:idSubtramite`, this.getProveedoresSubtramite.bind(this));
        this.router.get(`${this.basePath}/accesorio/getAccesorios/:idCotizacion/:idMarca/:idSucursal/:idParte/:Descripcion`, this.getAccesorios.bind(this));
        this.router.get(`${this.basePath}/accesorio/getAccesoriosNuevos/:idSucursal`, this.getAccesoriosNuevos.bind(this));
        this.router.post(`${this.basePath}/accesorio/saveAccesorioNuevo`, validate({ body: postAccesorioNuevo }), this.saveAccesorioNuevo.bind(this));
        // SISCO
        this.router.get(`${this.basePath}/accesorio/getAccesoriosSISCO/:idCotizacion`, /////////
        this.getAccesoriosSISCO.bind(this));
        // SISCO - POSTERIORES/ADICIONALES 20210128
        // SISCO Obtiene los accesorios para enviar solicitud a SISCO
        this.router.get(`${this.basePath}/accesorio/getAccesoriosSISCOPostAd/:idCotizacion`, /////////
        this.getAccesoriosSISCOPostAd.bind(this));
        // SISCO
        this.router.post(`${this.basePath}/accesorio/ActualizaSolicitudCotizacionAccesorio`, this.actualizaSolicitudCotizacionAccesorio.bind(this));
        // SISCO escenario 3
        this.router.post(`${this.basePath}/accesorio/guardaSolicitudAccesorioNuevo`, this.guardaSolicitudAccesorioNuevo.bind(this));
        // SISCO - POSTERIORES/ADICIONALES 20210128
        // SISCO escenario 3
        this.router.post(`${this.basePath}/accesorio/guardaSolicitudAccesorioNuevoPostAd`, this.guardaSolicitudAccesorioNuevoPostAd.bind(this));
        // SISCO escenario 1
        this.router.post(`${this.basePath}/accesorio/guardaSolicitudAccesorio`, this.guardaSolicitudAccesorio.bind(this));
        // SISCO - POSTERIORES/ADICIONALES 20210128
        // SISCO escenario 1
        this.router.post(`${this.basePath}/accesorio/guardaSolicitudAccesorioPostAd`, this.guardaSolicitudAccesorioPostAd.bind(this));
        // SISCO escenario 2
        this.router.post(`${this.basePath}/accesorio/guardaSolicitudAccesorioSISCO`, this.guardaSolicitudAccesorioSISCO.bind(this));
        // SISCO - POSTERIORES/ADICIONALES 20210128
        // SISCO escenario 2
        this.router.post(`${this.basePath}/accesorio/guardaSolicitudAccesorioSISCOPostAd`, this.guardaSolicitudAccesorioSISCOPostAd.bind(this));
        // elimina accesorio SISCO
        this.router.post(`${this.basePath}/accesorio/eliminaAccesorioSisco`, this.eliminaAccesorioSisco.bind(this));
        // SISCO - POSTERIORES/ADICIONALES 20210128
        // elimina accesorio SISCO
        this.router.post(`${this.basePath}/accesorio/eliminaAccesorioSiscoPostAd`, this.eliminaAccesorioSiscoPostAd.bind(this));
        // OCT 99 20201209 SISCO obtiene datos de acceso a SISCO
        this.router.get(`${this.basePath}/accesorio/getFlotillasDatosSISCO`, /////////
        this.getFlotillas_Datos_SISCO.bind(this));
        // guarda respuesta de insertar SOLICITUD en SISCO
        this.router.post(`${this.basePath}/accesorio/guardaSISCOSolicitudFlotillas`, this.guardaSISCOSolicitudFlotillas.bind(this));
        // CHK - 03 Feb 21k | guarda respuesta de insertar SOLICITUD en SISCO posteriores
        this.router.post(`${this.basePath}/accesorio/guardaSISCOSolicitudFlotillasPostAd`, this.guardaSISCOSolicitudFlotillasPostAd.bind(this));
        this.router.delete(`${this.basePath}/accesorio/:idAccesorioNuevo`, this.deleteAccesorioNuevo.bind(this));
        this.router.get(`${this.basePath}/accesorio/getAccesorios/:idMarca/:idSucursal`, this.getAccesorios.bind(this));
        this.router.get(`${this.basePath}/accesorio/getAccesorios/:idCotizacion/:idMarca/:idSucursal`, this.getAccesorios.bind(this));
        this.router.get(`${this.basePath}/servicioUnidad/getServiciosUnidad/:idSucursal/:catalogo/:anio`, this.getServiciosUnidad.bind(this));
        this.router.get(`${this.basePath}/paqueteServicioUnidad/getAll/:idSucursal`, this.getPaquetesServicioUnidad.bind(this));
        this.router.get(`${this.basePath}/paqueteServicioUnidad/getAll/:idSucursal/:catalogo`, this.getPaquetesServicioUnidad.bind(this));
        this.router.get(`${this.basePath}/paqueteServicioUnidad/getAll/:idSucursal/:catalogo/:anio`, this.getPaquetesServicioUnidad.bind(this));
        this.router.delete(`${this.basePath}/paqueteServicioUnidad/:idEncPaqueteServicioUnidad`, this.deletePaqueteServicioUnidad.bind(this));
        const schemaEncPaqueteServicioUnidad = ajv
            .addSchema(postDetPaqueteServicioUnidad)
            .compile(postEncPaqueteServicioUnidad).schema;
        this.router.post(`${this.basePath}/paqueteServicioUnidad/save`, validate({ body: schemaEncPaqueteServicioUnidad }), this.savePaqueteServicioUnidad.bind(this));
        this.router.get(`${this.basePath}/paqueteTramite/getAll/:idSucursal`, this.getPaquetesTramite.bind(this));
        this.router.delete(`${this.basePath}/paqueteTramite/:idEncPaqueteTramite`, this.deletePaqueteTramite.bind(this));
        const schemaEncPaqueteTramite = ajv
            .addSchema(postDetPaqueteTramite)
            .compile(postEncPaqueteTramite).schema;
        this.router.post(`${this.basePath}/paqueteTramite/save`, validate({ body: schemaEncPaqueteTramite }), this.savePaqueteTramite.bind(this));
        this.router.get(`${this.basePath}/paqueteAccesorios/getAll/:idSucursal`, this.getPaquetesAccesorios.bind(this));
        this.router.delete(`${this.basePath}/paqueteAccesorios/:idEncPaqueteAccesorio`, this.deletePaqueteAccesorios.bind(this));
        const schemaEncPaqueteAccesorios = ajv
            .addSchema(postDetPaqueteAccesorio)
            .compile(postEncPaqueteAccesorio).schema;
        this.router.post(`${this.basePath}/paqueteAccesorios/save`, this.savePaqueteAccesorios.bind(this));
        this.router.get(`${this.basePath}/getMonedasVenta/:idSucursal`, this.getMonedasVenta.bind(this));
        this.router.get(`${this.basePath}/getIvas/:idSucursal`, this.getIvas.bind(this));
        this.router.get(`${this.basePath}/getTiposVenta/:idSucursal/:idDireccionFlotillas`, this.getTiposVenta.bind(this));
        // Cambio bonificaciones - EHJ-COAL
        this.router.get(`${this.basePath}/unidad/guardaBonificacion/:idCotizacion`, this.guardaBonificacion.bind(this));
        this.router.get(`${this.basePath}/unidad/getBonificacion/:idSucursal/:idCatalogo/:modelo`, this.getBonificacion.bind(this));
        this.router.get(`${this.basePath}/marca/getMarcasExternas`, this.getMarcasExternas.bind(this));
        this.router.get(`${this.basePath}/empresa/getEmpresasExternas/:idMarca`, this.getEmpresasExternas.bind(this));
        this.router.get(`${this.basePath}/sucursal/getSucursalesExternas/:idEmpresa`, this.getSucursalesExternas.bind(this));
        this.router.get(`${this.basePath}/financiera/getFinancierasExternas/:idSucursal`, this.getFinancierasExternas.bind(this));
        this.router.get(`${this.basePath}/unidad/getUnidadesExterno/:idEmpresa`, this.getUnidadesExterno.bind(this));
        this.router.get(`${this.basePath}/unidad/getVersionesExterno/:idEmpresa/:idUnidadBpro`, this.getVersionesExterno.bind(this));
        this.router.post(`${this.basePath}/unidad/getModeloExterno`, validate({ body: postModeloFilter }), this.getModeloExterno.bind(this));
        this.router.get(`${this.basePath}/unidad/getCostoCatalagoExterno/:sucursal/:idCatalogo/:modelo`, this.getCostoCatalagoExterno.bind(this));
        this.router.get(`${this.basePath}/getCatalogoDatosFac/:idFac/:idTipo`, this.getCatalogoDatosFac.bind(this));
        this.router.post(`${this.basePath}/guardaDatosFacTramite`, this.guardaDatosFacTramite.bind(this));
        this.router.post(`${this.basePath}/guardaDatosFacTramiteMov`, this.guardaDatosFacTramiteMov.bind(this));
        this.router.post(`${this.basePath}/guardaDatosFacTraslado`, this.guardaDatosFacTraslado.bind(this));
    }
    sync(request, response) {
        const syncBusiness = new catalogo_1.SyncBusiness();
        syncBusiness.syncClientes().then((insertedRows) => {
            response.json({ affectedRows: insertedRows });
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getClientes(request, response) {
        const filtroCliente = request.body;
        const clienteBussiness = new catalogo_1.ClienteBussiness();
        clienteBussiness.getClientes(filtroCliente).then((clienteFilterResult) => {
            response.json(clienteFilterResult);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getCliente(request, response) {
        const idCliente = Number(request.params.idCliente);
        const clienteBussiness = new catalogo_1.ClienteBussiness();
        clienteBussiness.getCliente(idCliente).then((cliente) => {
            response.json(cliente);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    filtrarClientes(request, response) {
        const clienteBussiness = new catalogo_1.ClienteBussiness();
        const filtro = request.params.filtro;
        const tipoPersona = request.params.tipoPersona;
        clienteBussiness.filtrarClientes(filtro, tipoPersona)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    getAllRelDireccionFlotillas(request, response) {
        const clienteBussiness = new catalogo_1.ClienteBussiness();
        clienteBussiness.getAllRelDireccionFlotillas().then((relsDireccionFlotillas) => {
            response.json(relsDireccionFlotillas);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    saveRelsDireccionFlotillas(request, response) {
        const parametroRel = request.body;
        const clienteBussiness = new catalogo_1.ClienteBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        parametroRel.map((pr) => pr.direccionesFlotillas.map((df) => { df.idUsuarioModificacion = idUsuario; df.fechaModificacion = new Date(); }));
        clienteBussiness.saveRelsDireccionFlotillas(parametroRel, idUsuario).then((savedItems) => {
            response.json(savedItems);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getAllRelCfdis(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const clienteBussiness = new catalogo_1.ClienteBussiness();
        clienteBussiness.getAllRelCfdis(idUsuario).then((relsCfdis) => {
            response.json(relsCfdis);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    saveRelsCfdis(request, response) {
        const parametroRel = request.body;
        const clienteBussiness = new catalogo_1.ClienteBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        parametroRel.map((pr) => pr.cfdis.map((df) => { df.idUsuarioModificacion = idUsuario; df.fechaModificacion = new Date(); }));
        clienteBussiness.saveRelsCfdis(parametroRel, idUsuario).then((savedItems) => {
            response.json(savedItems);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getAllDireccionFlotillas(request, response) {
        const direccionFlotillasBusiness = new catalogo_1.DireccionFlotillasBusiness();
        direccionFlotillasBusiness.getAllDireccionFlotillas().then((direccionFlotillas) => {
            response.json(direccionFlotillas);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getAllCfdis(request, response) {
        const facturacionBusiness = new catalogo_1.FacturacionBussiness();
        facturacionBusiness.getAllCfdis().then((cfdis) => {
            response.json(cfdis);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getMarcas(request, response) {
        const marcaBusiness = new catalogo_1.MarcaBusiness();
        marcaBusiness.getMarcas().then((marcasResult) => {
            response.json(marcasResult);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    cobrarPrimerTraslado(request, response) {
        const marcaBusiness = new catalogo_1.MarcaBusiness();
        const idMarca = request.body.idMarca;
        marcaBusiness.cobrarPrimerTraslado(idMarca).then((res) => {
            response.status(200).json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    cobrarPrimerTrasladoCOAL(request, response) {
        const marcaBusiness = new catalogo_1.MarcaBusiness();
        const idMarca = request.body.idMarca;
        const idCotizacion = request.body.idCotizacion;
        const idGrupoUnidad = request.body.idGrupoUnidad;
        const idCotizacionTraslado = request.body.idCotizacionTraslado;
        marcaBusiness.cobrarPrimerTrasladoCOAL(idMarca, idCotizacion, idGrupoUnidad, idCotizacionTraslado).then((res) => {
            response.status(200).json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getEmpresas(request, response) {
        const idMarca = request.params.idMarca;
        const empresaBusiness = new catalogo_1.EmpresaBusiness();
        empresaBusiness.getEmpresas(idMarca).then((empresas) => {
            response.json(empresas);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getFinancieras(request, response) {
        const idSucursal = Number(request.params.idSucursal);
        const financieraBusiness = new catalogo_1.FinancieraBusiness();
        financieraBusiness.getFinancieras(idSucursal).then((financieras) => {
            response.json(financieras);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getSucursales(request, response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const sucursalBusiness = new catalogo_1.SucursalBusiness();
        sucursalBusiness.getSucursales(idEmpresa).then((sucursales) => {
            response.json(sucursales);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getInventarioUnidadesNuevas(request, response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const idSucursal = Number(request.params.idSucursal);
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.getInventarioUnidadesNuevas(idEmpresa, idSucursal).then((inventarioUnidades) => {
            response.json(inventarioUnidades);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getUnidadesBpro(request, response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.getUnidadesBpro(idEmpresa).then((unidadesBpro) => {
            response.json(unidadesBpro);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getVersiones(request, response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const idUnidadBpro = request.params.idUnidadBpro;
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.getVersionUnidades(idEmpresa, idUnidadBpro).then((versionUnidades) => {
            response.json(versionUnidades);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getCostoCatalago(request, response) {
        const sucursal = Number(request.params.sucursal);
        const idCatalogo = request.params.idCatalogo;
        const modelo = request.params.modelo;
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.getCostoCatalago(sucursal, idCatalogo, modelo)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((err) => {
            response.status(500).json(err);
        });
    }
    getColorExterior(request, response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const idUnidadBpro = request.params.idUnidadBpro;
        const idModelo = Number(request.params.idModelo);
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.getColorUnidades(false, idEmpresa, idUnidadBpro, idModelo).then((versionColorExterior) => {
            response.json(versionColorExterior);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getColorInterior(request, response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const idUnidadBpro = request.params.idUnidadBpro;
        const idModelo = Number(request.params.idModelo);
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.getColorUnidades(true, idEmpresa, idUnidadBpro, idModelo).then((versionColorExterior) => {
            response.json(versionColorExterior);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getModelos(request, response) {
        const modeloFilter = request.body;
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.getModelos(modeloFilter.idEmpresa, modeloFilter.idCatalogo, modeloFilter.anio).then((modelos) => {
            response.json(modelos);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getModeloExterno(request, response) {
        const modeloFilter = request.body;
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.getModeloExterno(modeloFilter.idEmpresa, modeloFilter.idCatalogo, modeloFilter.anio).then((modelos) => {
            response.json(modelos);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getProveedores(request, response) {
        const idSucursal = Number(request.params.idSucursal);
        const idTipoProveedor = (request.params.idTipoProveedor == undefined ? '' : request.params.idTipoProveedor);
        const proveedorBusiness = new catalogo_2.ProveedorBusiness();
        proveedorBusiness.getProveedores(idSucursal, idTipoProveedor).then((proveedores) => {
            response.json(proveedores);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getTramites(request, response) {
        const idMarca = request.params.idMarca;
        const idSucursal = Number(request.params.idSucursal);
        const idDireccionFlotillas = request.params.idDireccionFlotillas;
        const tramiteBusiness = new catalogo_1.TramiteBusiness();
        tramiteBusiness.getTramites(idMarca, idSucursal, idDireccionFlotillas).then((tramites) => {
            response.json(tramites);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getSubtramites(request, response) {
        const idMarca = request.params.idMarca;
        const idSucursal = Number(request.params.idSucursal);
        const idTramite = request.params.idTramite;
        const tramiteBusiness = new catalogo_1.TramiteBusiness();
        tramiteBusiness.getSubtramites(idMarca, idSucursal, idTramite).then((subtramites) => {
            response.json(subtramites);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getProveedoresSubtramite(request, response) {
        const idMarca = request.params.idMarca;
        const idSucursal = Number(request.params.idSucursal);
        const idSubtramite = Number(request.params.idSubtramite);
        const tramiteBusiness = new catalogo_1.TramiteBusiness();
        tramiteBusiness.getProveedoresSubtramite(idMarca, idSucursal, idSubtramite).then((proveedoresSubtramite) => {
            response.json(proveedoresSubtramite);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getAccesorios(request, response) {
        const idCotizacion = (request.params.idCotizacion === undefined ? '' : request.params.idCotizacion);
        const idMarca = request.params.idMarca;
        const idSucursal = Number(request.params.idSucursal);
        const idParte = '';
        const Descripcion = '';
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.getAccesorios(idCotizacion, idMarca, idSucursal, idParte, Descripcion).then((accesorios) => {
            response.json(accesorios);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getServiciosUnidad(request, response) {
        const idSucursal = Number(request.params.idSucursal);
        const catalogo = request.params.catalogo;
        const anio = request.params.anio;
        const servicioUnidadBusiness = new catalogo_1.ServicioUnidadBusiness();
        servicioUnidadBusiness.getServiciosUnidad(idSucursal, catalogo, anio).then((serviciosUnidad) => {
            response.json(serviciosUnidad);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getPaquetesServicioUnidad(request, response) {
        const idSucursal = Number(request.params.idSucursal);
        const catalogo = request.params.catalogo;
        const anio = request.params.anio;
        const servicioUnidadBusiness = new catalogo_1.ServicioUnidadBusiness();
        servicioUnidadBusiness.getPaquetesServicioUnidad(idSucursal, catalogo, anio).then((paquetesServicioUnidad) => {
            response.json(paquetesServicioUnidad);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    deletePaqueteServicioUnidad(request, response) {
        const idEncPaqueteServicioUnidad = Number(request.params.idEncPaqueteServicioUnidad);
        const servicioUnidadBusiness = new catalogo_1.ServicioUnidadBusiness();
        servicioUnidadBusiness.deletePaqueteServicioUnidad(idEncPaqueteServicioUnidad).then((deletedRows) => {
            response.json({ affectedRows: deletedRows });
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    savePaqueteServicioUnidad(request, response) {
        const encPaqueteServicioUnidad = request.body;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        encPaqueteServicioUnidad.idUsuarioModificacion = idUsuario;
        if (encPaqueteServicioUnidad.serviciosUnidad != undefined) {
            encPaqueteServicioUnidad.serviciosUnidad.map((d) => { d.idUsuarioModificacion = idUsuario; d.fechaModificacion = new Date(); });
        }
        const servicioUnidadBusiness = new catalogo_1.ServicioUnidadBusiness();
        servicioUnidadBusiness.savePaqueteServicioUnidad(encPaqueteServicioUnidad).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getPaquetesTramite(request, response) {
        const idSucursal = Number(request.params.idSucursal);
        const tramiteBusiness = new catalogo_1.TramiteBusiness();
        tramiteBusiness.getPaquetesTramite(idSucursal).then((paquetesTramite) => {
            response.json(paquetesTramite);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    deletePaqueteTramite(request, response) {
        const idEncPaqueteTramite = Number(request.params.idEncPaqueteTramite);
        const tramiteBusiness = new catalogo_1.TramiteBusiness();
        tramiteBusiness.deletePaqueteTramite(idEncPaqueteTramite).then((deletedRows) => {
            response.json({ affectedRows: deletedRows });
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    savePaqueteTramite(request, response) {
        const encPaqueteTramite = request.body;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        encPaqueteTramite.idUsuarioModificacion = idUsuario;
        if (encPaqueteTramite.tramites != undefined) {
            encPaqueteTramite.tramites.map((d) => { d.idUsuarioModificacion = idUsuario; d.fechaModificacion = new Date(); });
        }
        const tramiteBusiness = new catalogo_1.TramiteBusiness();
        tramiteBusiness.savePaqueteTramite(encPaqueteTramite).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getAccesoriosNuevos(request, response) {
        const idSucursal = Number(request.params.idSucursal);
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.getAccesoriosNuevos(idSucursal, idUsuario).then((accesoriosNuevos) => {
            response.json(accesoriosNuevos);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    saveAccesorioNuevo(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : '0');
        const accesorioNuevo = request.body;
        accesorioNuevo.idUsuario = idUsuario;
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.saveAccesorioNuevo(accesorioNuevo).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    // obtiene los accesorios SISCO que se enviaran para crear una solicitud en SISCO
    getAccesoriosSISCO(request, response) {
        const idCotizacion = (request.params.idCotizacion === undefined ? '' : request.params.idCotizacion);
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.getAccesoriosSISCO(idCotizacion).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    // SISCO - POSTERIORES/ADICIONALES 20210128
    // obtiene los accesorios SISCO que se enviaran para crear una solicitud en SISCO
    getAccesoriosSISCOPostAd(request, response) {
        const idCotizacion = (request.params.idCotizacion === undefined ? '' : request.params.idCotizacion);
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.getAccesoriosSISCOPostAd(idCotizacion).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    // SISCO escenario 3
    guardaSolicitudAccesorioNuevo(request, response) {
        const solicitudSisco = request.body;
        console.log(solicitudSisco);
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.guardaSolicitudAccesorioNuevo(solicitudSisco).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    // SISCO - POSTERIORES/ADICIONALES 20210128
    // SISCO escenario 3
    guardaSolicitudAccesorioNuevoPostAd(request, response) {
        const solicitudSisco = request.body;
        console.log(solicitudSisco);
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.guardaSolicitudAccesorioNuevoPostAd(solicitudSisco).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    // SISCO escenarios 1
    guardaSolicitudAccesorio(request, response) {
        const solicitudSisco = request.body;
        console.log(solicitudSisco);
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.guardaSolicitudAccesorio(solicitudSisco).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    // SISCO - POSTERIORES/ADICIONALES 20210128
    // SISCO escenarios 1
    guardaSolicitudAccesorioPostAd(request, response) {
        const solicitudSisco = request.body;
        console.log(solicitudSisco);
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.guardaSolicitudAccesorioPostAd(solicitudSisco).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    // SISCO escenarios 2
    guardaSolicitudAccesorioSISCO(request, response) {
        const solicitudSisco = request.body;
        console.log(solicitudSisco);
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.guardaSolicitudAccesorioSISCO(solicitudSisco).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    // SISCO - POSTERIORES/ADICIONALES 20210128
    // SISCO escenarios 2
    guardaSolicitudAccesorioSISCOPostAd(request, response) {
        const solicitudSisco = request.body;
        console.log(solicitudSisco);
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.guardaSolicitudAccesorioSISCOPostAd(solicitudSisco).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    // guarda respuesta de Solicitud en SISCO
    guardaSISCOSolicitudFlotillas(request, response) {
        const solicitudSisco = request.body;
        console.log(solicitudSisco);
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.guardaSISCOSolicitudFlotillas(solicitudSisco).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    // CHK - 03 Feb 21k | guarda respuesta de insertar SOLICITUD en SISCO posteriores
    guardaSISCOSolicitudFlotillasPostAd(request, response) {
        const solicitudSisco = request.body;
        console.log(solicitudSisco);
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.guardaSISCOSolicitudFlotillasPostAd(solicitudSisco).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    // elimina accesorio SISCO
    eliminaAccesorioSisco(request, response) {
        const accesorioSisco = request.body;
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.eliminaAccesorioSisco(accesorioSisco).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    // SISCO - POSTERIORES/ADICIONALES 20210128
    // elimina accesorio SISCO
    eliminaAccesorioSiscoPostAd(request, response) {
        const accesorioSisco = request.body;
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.eliminaAccesorioSiscoPostAd(accesorioSisco).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    // SISCO
    actualizaSolicitudCotizacionAccesorio(request, response) {
        const cotizacionSisco = request.body;
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.actualizaSolicitudCotizacionAccesorio(cotizacionSisco).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    // OCT 99 obtiene datos de acceso a SISCO
    getFlotillas_Datos_SISCO(request, response) {
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.getFlotillas_Datos_SISCO().then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    deleteAccesorioNuevo(request, response) {
        const idAccesorioNuevo = Number(request.params.idAccesorioNuevo);
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.deleteAccesorioNuevo(idAccesorioNuevo).then((deletedRows) => {
            response.json({ affectedRows: deletedRows });
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getPaquetesAccesorios(request, response) {
        const idSucursal = Number(request.params.idSucursal);
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.getPaquetesAccesorio(idSucursal).then((paquetesAccesorio) => {
            response.json(paquetesAccesorio);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    deletePaqueteAccesorios(request, response) {
        const idEncPaqueteAccesorio = Number(request.params.idEncPaqueteAccesorio);
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.deletePaqueteAccesorio(idEncPaqueteAccesorio).then((deletedRows) => {
            response.json({ affectedRows: deletedRows });
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    savePaqueteAccesorios(request, response) {
        const encPaqueteAccesorio = request.body;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        if (encPaqueteAccesorio.accesorios != undefined) {
            encPaqueteAccesorio.accesorios.map((d) => { d.idUsuarioModificacion = idUsuario; d.fechaModificacion = new Date(); });
        }
        encPaqueteAccesorio.idUsuarioModificacion = idUsuario;
        const accesorioBusiness = new catalogo_1.AccesorioBusiness();
        accesorioBusiness.savePaqueteAccesorio(encPaqueteAccesorio).then((res) => {
            response.json(res);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getMonedasVenta(request, response) {
        const idSucursal = Number(request.params.idSucursal == undefined ? '0' : request.params.idSucursal);
        const monedaVentaBusiness = new catalogo_2.MonedaVentaBusiness();
        monedaVentaBusiness.getMonedasVenta(idSucursal).then((res) => {
            response.status(200).json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getIvas(request, response) {
        const idSucursal = Number(request.params.idSucursal == undefined ? '0' : request.params.idSucursal);
        const ivaBusiness = new catalogo_1.IvaBusiness();
        ivaBusiness.getIvas(idSucursal).then((res) => {
            response.status(200).json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getTiposVenta(request, response) {
        const idSucursal = Number(request.params.idSucursal == undefined ? '0' : request.params.idSucursal);
        const idDireccionFlotillas = request.params.idDireccionFlotillas == undefined ? '' : request.params.idDireccionFlotillas;
        const tipoVentaBusiness = new catalogo_2.TipoVentaBusiness();
        tipoVentaBusiness.getTiposVentas(idSucursal, idDireccionFlotillas).then((res) => {
            response.status(200).json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getBonificacion(request, response) {
        const sucursal = request.params.idSucursal;
        const idCatalogo = request.params.idCatalogo;
        const modelo = request.params.modelo;
        const BonificacionBusiness = new catalogo_1.InventarioUnidadBusiness();
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
    guardaBonificacion(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const BonificacionBusiness = new catalogo_1.InventarioUnidadBusiness();
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
    getMarcasExternas(request, response) {
        const marcaBusiness = new catalogo_1.MarcaBusiness();
        marcaBusiness.getMarcasExternas().then((marcasResult) => {
            response.json(marcasResult);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getEmpresasExternas(request, response) {
        const idMarca = request.params.idMarca;
        const empresaBusiness = new catalogo_1.EmpresaBusiness();
        empresaBusiness.getEmpresasExternas(idMarca).then((empresas) => {
            response.json(empresas);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getSucursalesExternas(request, response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const sucursalBusiness = new catalogo_1.SucursalBusiness();
        sucursalBusiness.getSucursalesExternas(idEmpresa).then((sucursales) => {
            response.json(sucursales);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getFinancierasExternas(request, response) {
        const idSucursal = Number(request.params.idSucursal);
        const financieraBusiness = new catalogo_1.FinancieraBusiness();
        financieraBusiness.getFinancierasExternas(idSucursal).then((financieras) => {
            response.json(financieras);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getUnidadesExterno(request, response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.getUnidadesExterno(idEmpresa).then((unidadesBpro) => {
            response.json(unidadesBpro);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getVersionesExterno(request, response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const idUnidadBpro = request.params.idUnidadBpro;
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.getVersionUnidadesExterno(idEmpresa, idUnidadBpro).then((versionUnidades) => {
            response.json(versionUnidades);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getCostoCatalagoExterno(request, response) {
        const sucursal = Number(request.params.sucursal);
        const idCatalogo = request.params.idCatalogo;
        const modelo = request.params.modelo;
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.getCostoCatalagoExterno(sucursal, idCatalogo, modelo)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((err) => {
            response.status(500).json(err);
        });
    }
    getCatalogoDatosFac(request, response) {
        const idFac = request.params.idFac;
        const idTipo = request.params.idTipo;
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.getCatalogoDatosFac(idFac, idTipo)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((err) => {
            response.status(500).json(err);
        });
    }
    guardaDatosFacTramite(request, response) {
        const idCotizacion = request.body[0].idCotizacion;
        const idGrupoUnidad = Number(request.body[0].idGrupoUnidad);
        const idDetalleUnidad = Number(request.body[0].idDetalleUnidad);
        const idTramite = request.body[0].idTramite;
        const idSubtramite = request.body[0].idSubtramite;
        const precio = Number(request.body[0].precio);
        const datosFac = request.body[0].datosFac;
        const idUsuario = Number((request.headers.idUsuario) ? request.headers.idusuario : 0);
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.guardaDatosFacTramite(idCotizacion, idGrupoUnidad, idDetalleUnidad, idTramite, idSubtramite, precio, datosFac, idUsuario)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((err) => {
            response.status(500).json(err);
        });
    }
    guardaDatosFacTramiteMov(request, response) {
        const idCotizacion = request.body[0].idCotizacion;
        const idGrupoUnidad = Number(request.body[0].idGrupoUnidad);
        const idDetalleUnidad = Number(request.body[0].idDetalleUnidad);
        const idTramite = request.body[0].idTramite;
        const idSubtramite = request.body[0].idSubtramite;
        const precio = Number(request.body[0].precio);
        const datosFac = request.body[0].datosFac;
        const idUsuario = Number((request.headers.idUsuario) ? request.headers.idusuario : 0);
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.guardaDatosFacTramiteMov(idCotizacion, idGrupoUnidad, idDetalleUnidad, idTramite, idSubtramite, precio, datosFac, idUsuario)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((err) => {
            response.status(500).json(err);
        });
    }
    guardaDatosFacTraslado(request, response) {
        const idCotizacionTraslado = Number(request.body[0].idCotizacionTraslado);
        const idCotizacion = request.body[0].idCotizacion;
        const idGrupoUnidad = Number(request.body[0].idGrupoUnidad);
        const idTraslado = Number(request.body[0].idTraslado);
        const datosFac = request.body[0].datosFac;
        const idUsuario = Number((request.headers.idUsuario) ? request.headers.idusuario : 0);
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.guardaDatosFacTraslado(idCotizacionTraslado, idCotizacion, idGrupoUnidad, idTraslado, datosFac, idUsuario)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((err) => {
            response.status(500).json(err);
        });
    }
}
exports.CatalogoController = CatalogoController;
//# sourceMappingURL=catalogo.controller.js.map