import { PaqueteAccesorios, AccesorioSinPaquete } from './accesorio.model';
import { PaqueteTramite, TramiteSinPaquete } from './tramite.model';
import { PaqueteServicio, ServicioUnidadSinPaquete } from './servicioUnidad.model';

export class Cotizacion {
  idCotizacion: string;
  idDireccionFlotillas: string;
  idCliente: number;
  nombreCliente: string;
  clienteOriginal: string;
  idCondicion: string;
  nombreCondicion: string;
  idEmpresa: number;
  nombreEmpresa: string;
  idMarca: string;
  idSucursal: number;
  nombreSucursal: string;
  idUsuario: string;
  unidades: number;
  idLicitacion: string;
  idFinanciera: number;
  nombreFinanciera: string;
  idCfdi: string;
  idCfdiAdicionales: string;
  nombreCfdi: string;
  tipoOrden: string;
  status: string;
  step: number;
  idUsuarioModificacion: number;
  fechaModificacion: Date;
  gruposUnidades: GrupoUnidades[];
  precioTotal: number;
  costoTotal: number;
  idIva: string;
  tasaIva: number;
  idTipoVenta: string;
  idMonedaVenta: string;
  nombreTipoVenta: string;
  nombreMoneda: string;
  nombreIva: string;
  idClienteContacto: string;
  nombreContacto: string;
  notificacion: any;
  tipoCargoUnidad: string;
  bonificacion: any;
  imprimeFactura: boolean;
  ivaTotal: number;
  porcentajeUtilidad: number;
}

export interface UnidadInteres {
  idInventario: number;
  idCotizacion: string;
  idGrupoUnidad: number;
  idDireccionFlotillas: string;
  tipoUnidad: string;
  anio: string;
  modelo: string;
  idColorInterior: string;
  colorInterior: string;
  idColorExterior: string;
  colorExterior: string;
  clase: string;
  catalogo: string;
  precio: number;
  costo: number;
  cantidad: number;
  marca: string;
  antiguedad: number;
  segmento: string;
  descripcion: string;
  agencia: string;
  clasificacionTipoCompra: string;
  vin: string;
  idEmpresa: number;
  idSucursal: number;
  db: string;
  tipoBase: string;
  idEstatusUnidadInteres: number;
  idUsuarioModificacion: number;
  fechaModificacion: Date;
  isSelected: boolean;
}

export interface UnidadInteresFilter {
  idEmpresa: number;
  idSucursal: number;
  catalogo: string;
  anio: string;
  idColorInterior: string;
  colorInterior: string;
  idColorExterior: string;
  colorExterior: string;
  clase: string;
  modelo: string;
}

//OCT99
export class GrupoUnidadesUnidadInteres {
  idCotizacion: string;
  idGrupoUnidad: number;
  catalogo: string;
  imprimeFactura: boolean;
  tipoCargoUnidad: string;
  anio: string;
  clase: string;
  modelo: string;
  precioTotalTotal: number;
  versionUnidad: string;
  idColorInterior: string;
  colorInterior: string;
  idColorExterior: string;
  colorExterior: string;
  cantidad: number;
  precio: number;
  costo: number;
  idCondicion: string;
  idFinanciera: number;
  nombreFinanciera: string;
  colorInteriorFacturacion: string;
  colorExteriorFacturacion: string;
  idCfdi: string;
  idCfdiAdicionales: string;
  tipoOrden: string;
  leyendaFactura: string;
  idIva: string;
  tasaIva: number;
  fechaHoraPromesaEntrega: string;
  costoTotal: number;
  precioTotal: number;
  utilidadBruta: number;
  idUsuarioModificacion: number;
  fechaModificacion: string;
  detalleUnidades: DetalleUnidades[];
  unidadesInteres: UnidadInteres[];
  paquetesAccesorios: PaqueteAccesorios[];
  accesoriosSinPaquete: AccesorioSinPaquete[];
  paquetesTramites: PaqueteTramite[];
  tramitesSinPaquete: TramiteSinPaquete[];
  paquetesServicioUnidad: PaqueteServicio[];
  serviciosUnidadSinPaquete: ServicioUnidadSinPaquete[];
  isToggled: boolean;
  traslados: CotizacionTraslado[];
  porcentajeUtilidad: number;
  cargoAccesorio: number;//OCT99
  cargoTramite: number;//OCT99
  cargoServicio: number;//OCT99
  unidadesIntereses: number;//OCT99
}

export class GrupoUnidades {
  idCotizacion: string;
  idGrupoUnidad: number;
  catalogo: string;
  imprimeFactura: boolean;
  tipoCargoUnidad: string;
  anio: string;
  clase: string;
  modelo: string;
  precioTotalTotal: number;
  versionUnidad: string;
  idColorInterior: string;
  colorInterior: string;
  idColorExterior: string;
  colorExterior: string;
  cantidad: number;
  precio: number;
  costo: number;
  idCondicion: string;
  idFinanciera: number;
  nombreFinanciera: string;
  colorInteriorFacturacion: string;
  colorExteriorFacturacion: string;
  idCfdi: string;
  idCfdiAdicionales: string;
  tipoOrden: string;
  leyendaFactura: string;
  idIva: string;
  tasaIva: number;
  fechaHoraPromesaEntrega: string;
  costoTotal: number;
  precioTotal: number;
  utilidadBruta: number;
  idUsuarioModificacion: number;
  fechaModificacion: string;
  detalleUnidades: DetalleUnidades[];
  unidadesInteres: UnidadInteres[];
  paquetesAccesorios: PaqueteAccesorios[];
  accesoriosSinPaquete: AccesorioSinPaquete[];
  paquetesTramites: PaqueteTramite[];
  tramitesSinPaquete: TramiteSinPaquete[];
  paquetesServicioUnidad: PaqueteServicio[];
  serviciosUnidadSinPaquete: ServicioUnidadSinPaquete[];
  isToggled: boolean;
  traslados: CotizacionTraslado[];
  porcentajeUtilidad: number;
  cargoAccesorio: number;//OCT99
  cargoTramite: number;//OCT99
  cargoServicio: number;//OCT99
  unidadesIntereses: number;//OCT99
}

export interface CotizacionTraslado {
  idCotizacionTraslado: number;
  idCotizacionTrasladoPadre: number;
  idCotizacion: string;
  idGrupoUnidad: number;
  idTraslado: number;
  cantidad: number;
  fechaEntrega: string;
  costoUnitario: number;
  precioUnitario: number;
  costoTotal: number;
  precioTotal: number;
  idProveedor: number;
  nombreProveedor: string;
  impuestoTransporte: number;
  idMedioTransporte: boolean;
  utilidadTotal: number;
  idCfdi: string;
}

export interface CotizacionTrasladoFac {
  idCotizacionTraslado: number;
  idCotizacion: string;
  idGrupoUnidad: number;
  idTraslado: number;
  datosFac: string;
  idUsuarioModificacion: number;
}

export interface DetalleUnidades {
  idCotizacion: string;
  idGrupoUnidad: number;
  idDetalleUnidad: number;
  idCondicion: string;
  idFinanciera: number;
  nombreFinanciera: string;
  imprimeFactura: boolean;
  porcentajeUtilidad: number;
  tipoCargoUnidad: string;
  colorInteriorFacturacion: string;
  colorExteriorFacturacion: string;
  idCfdi: string;
  idCfdiAdicionales: string;
  tipoOrden: string;
  leyendaFactura: string;
  idIva: string;
  tasaIva: number;
  fechaHoraPromesaEntrega: string;
  costoTotal: number;
  precioTotal: number;
  utilidadBruta: number;
  idUsuarioModificacion: number;
  fechaModificacion: Date;
  vin: string;
  tramites: any;
  tramitesMov: any;
  accesorios: any;
  accesoriosMov: any;
  estatus: any;
  tipoMovimiento: any;
  cargoAccesorio: number;//OCT99
  cargoTramite: number;//OCT99
  cargoServicio: number;//OCT99
}
