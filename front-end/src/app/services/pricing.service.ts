import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { Cotizacion, GrupoUnidades, UnidadInteres } from '../models/cotizacion.model';
import { PaqueteAccesorios, TramiteUnidad, TramiteSinPaquete, PaqueteTramite, ServicioUnidadSinPaquete, PaqueteServicio, AccesorioSinPaquete, Accesorio, UnidadesGestion, AccesorioNuevoUnidad, ServicioUnidadSinPaqueteUnidad } from '../models';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PricingService {
  constructor(
    private http: HttpClient,
    private appService: AppService
  ) { }

  getClientesFis(filtro, tipoPersona) {
    return this.http.get(`${this.appService.url}catalogo/cliente/filtrarClientes/${filtro}/${tipoPersona}`);
  }

  updateStep(idCotizacion: string, step: number) {
    return this.http.put(`${this.appService.url}cotizador/updateStep/${idCotizacion}/${step}`, null);
  }

  updateTipoOrden(idCotizacion: string, idCfdiAdicionales: string) {
    return this.http.put(`${this.appService.url}cotizador/updateTipoOrden/${idCotizacion}/${idCfdiAdicionales}`, null);
  }
  //OCT99 20200915
  updateCotizacionGruposTipoOrden(idCotizacion: string, tipoOrden: string, idCfdiAdicionales: string, tipoCargoUnidad: string, imprimeFactura: boolean) {
    return this.http.put(`${this.appService.url}cotizador/updateCotizacionGruposTipoOrden/${idCotizacion}/${tipoOrden}/${idCfdiAdicionales}/${tipoCargoUnidad}/${imprimeFactura}`, null);
  }
  //OCT99 20200915
  updateGruposTipoOrden(idCotizacion: string, idGrupoUnidad: number, tipoOrden: string, idCfdiAdicionales: string, tipoCargoUnidad: string, imprimeFactura: boolean) {
    return this.http.put(`${this.appService.url}cotizador/updateGruposTipoOrden/${idCotizacion}/${idGrupoUnidad}/${tipoOrden}/${idCfdiAdicionales}/${tipoCargoUnidad}/${imprimeFactura}`, null);
  }

  updateCfdiAdicionales(idCotizacion: string, tipoOrden: string) {
    return this.http.put(`${this.appService.url}cotizador/updateCfdiAdicionales/${idCotizacion}/${tipoOrden}`, null);
  }

  getPricings() { // Servicio para consultar todas las cotizaciones
    return this.http.get(`${this.appService.url}cotizador/getCotizaciones`).pipe(map(res => res));
  }

  isFreeTransfer(marca) {
    return this.http.post(`${this.appService.url}catalogo/valida/cobrarPrimerTraslado`, {idMarca: marca})
    .pipe(map(res => res));
  }

  isFreeTransferCOAL(marca,idCotizacion,idGrupoUnidad,idCotizacionTraslado) {
    return this.http.post(`${this.appService.url}catalogo/valida/cobrarPrimerTrasladoCOAL`, {idMarca: marca, idCotizacion:idCotizacion,idGrupoUnidad:idGrupoUnidad,idCotizacionTraslado:idCotizacionTraslado})
    .pipe(map(res => res));
  }

  getPricingById(idCotizacion: string) {// Servicio para consultar un cotizacion por su ID
    return this.http.get(`${this.appService.url}cotizador/getCotizacionById/${idCotizacion}`);
  }

  getGrupoUnidadByIdCotizacion(idCotizacion: string) {// Servicio para consultar un cotizacion por su ID
    return this.http.get(`${this.appService.url}cotizador/grupoUnidades/getGrupoUnidadByIdCotizacion/${idCotizacion}`);
  }
  //OCT99 GESTION
  getCotizacionGestionByIdCotizacion(idCotizacion: string) {// Servicio para consultar un cotizacion por su ID
    return this.http.get(`${this.appService.url}cotizador/gestionFlotillas/getCotizacionGestionByIdCotizacion/${idCotizacion}`);
  }

  getUnidadesInteresByIdCotizacion(idCotizacion: string) {// OCT99
    return this.http.get(`${this.appService.url}cotizador/grupoUnidades/getUnidadesInteresByIdCotizacion/${idCotizacion}`);
  }
  //OCT99
  getUnidadesCierreByIdCotizacion(idCotizacion: string) {// OCT99
    return this.http.get(`${this.appService.url}cotizador/grupoUnidades/getUnidadesCierreByIdCotizacion/${idCotizacion}`);
  }
  //OCT99
  getUnidadesInteresGrupoByIdCotizacion(idCotizacion: string) {// OCT99
    return this.http.get(`${this.appService.url}cotizador/grupoUnidades/getUnidadesInteresGrupoByIdCotizacion/${idCotizacion}`);
  }
  //OCT99
  getAdicionalesCierrebyIdCotizacionGrupoUnidad(idCotizacion: string, idCotizacionGrupoUnidad: number) {// OCT99
    return this.http.get(`${this.appService.url}cotizador/grupoUnidades/getAdicionalesCierrebyIdCotizacionGrupoUnidad/${idCotizacion}/${idCotizacionGrupoUnidad}`);
  }
  //OCT99 GESTION
  getAdicionalesGestionbyIdDetalleUnidad(idCotizacion: string, idCotizacionGrupoUnidad: number, idDetalleUnidad: number) {// OCT99
    return this.http.get(`${this.appService.url}cotizador/gestionFlotillas/getAdicionalesGestionbyIdDetalleUnidad/${idCotizacion}/${idCotizacionGrupoUnidad}/${idDetalleUnidad}`);
  }
  //OCT99 GESTION
  getAdicionalesGestionbyGrupal(idCotizacion: string, idCotizacionGrupoUnidad: number) {// OCT99
    return this.http.get(`${this.appService.url}cotizador/gestionFlotillas/getAdicionalesGestionbyGrupal/${idCotizacion}/${idCotizacionGrupoUnidad}`);
  }
  //OCT99
  getDetalleUnidadGrupoByIdCotizacionGrupo(idCotizacion: string, idCotizacionGrupoUnidad: number) {// OCT99
    return this.http.get(`${this.appService.url}cotizador/grupoUnidades/getDetalleUnidadGrupoByIdCotizacionGrupo/${idCotizacion}/${idCotizacionGrupoUnidad}`);
  }
  getFacturacionUnidades(idCotizacion: string) {
    return this.http.get(`${this.appService.url}cotizador/getFacturacionUnidades/${idCotizacion}`);
  }

  getPricingsByIdLicitacion(idLicitacion: string) { // Servicio para consultar contizaciones por idLicitacion
    return this.http.get(`${this.appService.url}cotizador/getCotizacionesByIdLicitacion/${idLicitacion}`);
  }

  getPricingsByIdDireccionFlotillas(idDireccionFlotillas: string) { // Servicio para consultar cotizaciones por idDireccionflotillas
    return this.http.get(`${this.appService.url}cotizador/getCotizacionesByIdFlotillas/${idDireccionFlotillas}`);
  }

  getPricingsByIdDireccionFlotillasByUser(idDireccionFlotillas: string, idUsuario: number) {
    // Servicio para consultar cotizaciones por idDireccionflotillas
    return this.http.get(`${this.appService.url}cotizador/getCotizacionesByIdFlotillasByUser/${idDireccionFlotillas}/${idUsuario}`);
  }

  createPricing(cotizaciones: Cotizacion[],idTipoVenta: string,idContrato: string) { // Servicio para crear cotizaciones
    return this.http.post(`${this.appService.url}cotizador/insertCotizacion/${idTipoVenta}/${idContrato}`, cotizaciones)
      .pipe(map(res => res));
  }

  checkLicitacion(idLicitacion: string) { // Servicio para verificar si una licitracion existe
    return this.http.get(`${this.appService.url}cotizador/existeLicitacion/${idLicitacion}`);
  }

  cerrarCotizador(cerrarCotizador: { idCotizacion: string, numeroOrden: string, orden: string }) {
    return this.http.post(`${this.appService.url}cotizador/cerrarCotizacion`, cerrarCotizador)
      .pipe(map(res => res));
  }

  asignarVinesApartados(idCotizacion: string) {
    return this.http.get(`${this.appService.url}cotizador/asignarVinesApartados/${idCotizacion}`);
  }

  enviarControlDocumental(idCotizacion: number) {
    return this.http.get(`${this.appService.url}cotizador/enviarControlDocumental/${idCotizacion}`);
  }

  enviarProducción(idCotizacion: number) {
    return this.http.get(`${this.appService.url}cotizador/enviarProduccion/${idCotizacion}`);
  }

  getMonedasVenta(idSucursal: number) {
    return this.http.get(`${this.appService.url}catalogo/getMonedasVenta/${idSucursal}`);
  }

  enviarCorreo(correoRequest) {
    return this.http.post(`${this.appService.url}cotizador/enviarCorreo`, correoRequest)
      .pipe(map(res => res));
  }

  enviarEmail(correoRequest) {
    return this.http.post(`${this.appService.url}cotizador/enviarEmail`, correoRequest)
      .pipe(map(res => res));
  }
  getConsultaCorreosCompras(idCotizacion:string) {
    return this.http.get(`${this.appService.url}cotizador/getConsultaCorreosCompras/${idCotizacion}`);
      //.pipe(map(res => res));
  }
  saveGrupoUnidades(grupoUnidades: GrupoUnidades) {
    return this.http.post(`${this.appService.url}cotizador/grupoUnidades/save`, grupoUnidades)
      .pipe(map(res => res));
  }

  saveGrupoUnidadesPost(grupoUnidades: GrupoUnidades) {
    return this.http.post(`${this.appService.url}pedido/guardarUnidadGestionFlotillas`, grupoUnidades)
      .pipe(map(res => res));
  }

  actualizarUnidad(idCotizacion: string, idGrupoUnidad: number, reserved: UnidadInteres[]) {
    const body = reserved;
    return this.http.post(`${this.appService.url}cotizador/solicitarApartadoUnidadInteresDelete/${idCotizacion}/${idGrupoUnidad}`, body)
      .pipe(map(res => res));
  }

  validaVinAsignados(vins) {
    return this.http.post(`${this.appService.url}cotizador/validaVinAsignados`, vins)
      .pipe(map(res => res));
  }

  crearGrupoUnidad(idCotizacion: string, idGrupoUnidad: number, reserved: UnidadInteres[]) {
    const body = reserved;
    return this.http.post(`${this.appService.url}cotizador/solicitarApartadoUnidadInteresCreate/${idCotizacion}/${idGrupoUnidad}`, body)
      .pipe(map(res => res));
  }

  // Servicio para insertar los detalles de unidad
  saveDetalleUnidades(detalleUnidades: Array<{ idCotizacion: string, idGrupoUnidad: number, cantidad: number }>,pantalla: string) {
    return this.http.post(`${this.appService.url}cotizador/detalleUnidades/save/${pantalla}`, detalleUnidades)
      .pipe(map(res => res));
  }

  deleteGruposUnidades(idCotizacion: string, idGrupoUnidad: number) { // Servicio para eliminar un grupo de unidades
    return this.http.delete(`${this.appService.url}cotizador/grupoUnidades/${idCotizacion}/${idGrupoUnidad}`)
      .pipe(map(res => res));
  }

  deleteUnidadInteres(idCotizacion: string, vin: string) {
    return this.http.delete(`${this.appService.url}cotizador/deleteUnidadInteres/${idCotizacion}/${vin}`);
  }

  saveAccesoriosGrupos(idCotizacion: string, idGrupoUnidad: number, accesorios: PaqueteAccesorios[]) {
    return this.http.post(`${this.appService.url}cotizador/saveCotizacionGrupoAccesorios/${idCotizacion}/${idGrupoUnidad}`,
      accesorios).pipe(map(res => res));
  }

  saveCotizacionGrupoTramite(idCotizacion: string, idGrupoUnidad: number, paquetesTramite: PaqueteTramite[]) {
    return this.http.post(`${this.appService.url}cotizador/saveCotizacionGrupoTramite/${idCotizacion}/${idGrupoUnidad}`,
      paquetesTramite).pipe(map(res => res));
  }

  saveCotizacionGrupoAccesorios(idCotizacion: string, idGrupoUnidad: number, accesorios: PaqueteAccesorios[]) {
    return this.http.post(`${this.appService.url}cotizador/saveCotizacionGrupoAccesorios/${idCotizacion}/${idGrupoUnidad}`,
      accesorios).pipe(map(res => res));
  }

  saveCotizacionGrupoAccesoriosSinPaquete(accesorios: AccesorioSinPaquete[]) {
    return this.http.post(`${this.appService.url}/cotizador/saveCotizacionGrupoAccesoriosSinPaquete`, accesorios)
      .pipe(map(res => res));
  }

  saveCotizacionGrupoAccesoriosSinPaqueteTodos(accesorios: AccesorioSinPaquete[]) {
    return this.http.post(`${this.appService.url}/cotizador/saveCotizacionGrupoAccesoriosSinPaqueteTodos`, accesorios)
      .pipe(map(res => res));
  }


  saveCotizacionGrupoTramiteSinPaquete(tramitesSinPaquete: TramiteSinPaquete[]) {
    return this.http.post(`${this.appService.url}cotizador/saveCotizacionGrupoTramitesSinPaquete`,
      tramitesSinPaquete).pipe(map(res => res));
  }

  saveCotizacionGrupoServicioUnidad(idCotizacion: string, idGrupoUnidad: number, paquetesServicio: PaqueteServicio[]) {
    return this.http.post(`${this.appService.url}cotizador/saveCotizacionGrupoServicioUnidad/${idCotizacion}/${idGrupoUnidad}`,
      paquetesServicio).pipe(map(res => res));
  }

  saveCotizacionGrupoServiciosUnidadSinPaquete(serviciosUnidadSinPaquete: ServicioUnidadSinPaquete[]) {
    return this.http.post(`${this.appService.url}cotizador/saveCotizacionGrupoServiciosUnidadSinPaquete`,
      serviciosUnidadSinPaquete).pipe(map(res => res));
  }

  saveCotizacionUnidadTramiteMovs(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number, tramite: TramiteUnidad[]) {
    return this.http.post(`${this.appService.url}cotizador/saveCotizacionUnidadTramiteMovs/${idCotizacion}/${idGrupoUnidad}
    /${idDetalleUnidad}`, tramite).pipe(map(res => res));
  }
  //OCT 99 GESTION
  saveCotizacionUnidadTramiteGrupal(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number, tramite: TramiteUnidad[]) {
    return this.http.post(`${this.appService.url}cotizador/saveCotizacionUnidadTramiteGrupal/${idCotizacion}/${idGrupoUnidad}
    /${idDetalleUnidad}`, tramite).pipe(map(res => res));
  }

  //OCT 99 GESTION
  deleteCotizacionUnidadTramiteGrupal(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number, tramite: TramiteUnidad[]) {
    return this.http.post(`${this.appService.url}cotizador/deleteCotizacionUnidadTramiteGrupal/${idCotizacion}/${idGrupoUnidad}
    /${idDetalleUnidad}`, tramite).pipe(map(res => res));
  }

  saveCambioDeProveedor(tramite: any) {
    return this.http.post(`${this.appService.url}/cotizador/saveCambioDeProveedor`,tramite)
      .pipe(map(res => res));
  }

  saveCotizacionUnidadAccesorioMovs(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number,
    accesorios: AccesorioNuevoUnidad[]) {
    return this.http.post(`${this.appService.url}cotizador/saveCotizacionUnidadAccesorioMovs/${idCotizacion}/${idGrupoUnidad}
    /${idDetalleUnidad}`, accesorios).pipe(map(res => res));
  }

  // OCT99 BORRA ACCESORIO POR UNIDAD GESTION - POSTERIOR
  // 20201106
  deleteCotizacionUnidadAccesorioMovs(accesorios: any) {
    return this.http.post(`${this.appService.url}/cotizador/deleteCotizacionUnidadAccesorioMovs`, accesorios)
      .pipe(map(res => res));
      }

  // OCT99 BORRA TRAMITE POR UNIDAD GESTION - POSTERIOR
  // 20201106
  deleteCotizacionUnidadTramiteMovs(tramite: any) {
    return this.http.post(`${this.appService.url}/cotizador/deleteCotizacionUnidadTramiteMovs`, tramite)
      .pipe(map(res => res));
  }
  // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
  // 20201110
  getListadoAccesoriosGrupos(idCotizacion: string, idGrupoUnidad: number, fuente: number) {// OCT99
    return this.http.get(`${this.appService.url}cotizador/getListadoAccesoriosGrupos/${idCotizacion}/${idGrupoUnidad}/${fuente}`);
  }

  // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
  // 20201110
  actualizaTipoOdenAccesorioGrupos(accesorio: any) {
    return this.http.post(`${this.appService.url}/cotizador/actualizaTipoOdenAccesorioGrupos`, accesorio)
      .pipe(map(res => res));
  }

  // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
  // 20201202
  actualizaTipoOdenAccesorioGruposMovs(accesorio: any) {
    return this.http.post(`${this.appService.url}/cotizador/actualizaTipoOdenAccesorioGruposMovs`, accesorio)
      .pipe(map(res => res));
  }

  // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
  // 20201110
  getListadoTramitesGrupos(idCotizacion: string, idGrupoUnidad: number, fuente: number) {// OCT99
    return this.http.get(`${this.appService.url}cotizador/getListadoTramitesGrupos/${idCotizacion}/${idGrupoUnidad}/${fuente}`);
  }

  // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
  // 20201110
  actualizaTipoOdenTramiteGrupos(tramite: any) {
    return this.http.post(`${this.appService.url}/cotizador/actualizaTipoOdenTramiteGrupos`, tramite)
      .pipe(map(res => res));
  }

  // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
  // 20201202
  actualizaTipoOdenTramiteGruposMovs(tramite: any) {
    return this.http.post(`${this.appService.url}/cotizador/actualizaTipoOdenTramiteGruposMovs`, tramite)
      .pipe(map(res => res));
  }

  // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
  // 20201110
  getListadoServiciosGrupos(idCotizacion: string, idGrupoUnidad: number, fuente: number) {// OCT99
    return this.http.get(`${this.appService.url}cotizador/getListadoServiciosGrupos/${idCotizacion}/${idGrupoUnidad}/${fuente}`);
  }

  // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
  // 20201110
  actualizaTipoOdenServicioGrupos(servicio: any) {
    return this.http.post(`${this.appService.url}/cotizador/actualizaTipoOdenServicioGrupos`, servicio)
      .pipe(map(res => res));
  }

  // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
  // 20201202
  actualizaTipoOdenServicioGruposMovs(servicio: any) {
    return this.http.post(`${this.appService.url}/cotizador/actualizaTipoOdenServicioGruposMovs`, servicio)
      .pipe(map(res => res));
  }

  saveCotizacionUnidadServicioMovs(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number,
    serviciosUnidadPorGuardar: ServicioUnidadSinPaqueteUnidad[]) {
    return this.http.post(`${this.appService.url}cotizador/saveCotizacionUnidadServicioMovs/${idCotizacion}/${idGrupoUnidad}
    /${idDetalleUnidad}`, serviciosUnidadPorGuardar).pipe(map(res => res));
  }
  //OCT 99 GESTION
  saveCotizacionUnidadServicioGrupal(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number,
    serviciosUnidadPorGuardar: ServicioUnidadSinPaqueteUnidad[]) {
    return this.http.post(`${this.appService.url}cotizador/saveCotizacionUnidadServicioGrupal/${idCotizacion}/${idGrupoUnidad}
    /${idDetalleUnidad}`, serviciosUnidadPorGuardar).pipe(map(res => res));
  }

  //OCT 99 GESTION
  deleteCotizacionUnidadServicioGrupal(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number,
    serviciosUnidadPorGuardar: ServicioUnidadSinPaqueteUnidad[]) {
    return this.http.post(`${this.appService.url}cotizador/deleteCotizacionUnidadServicioGrupal/${idCotizacion}/${idGrupoUnidad}
    /${idDetalleUnidad}`, serviciosUnidadPorGuardar).pipe(map(res => res));
  }

  //OCT 99 GESTION
  saveGestionUnidadAccesorioGrupal(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number,
    serviciosUnidadPorGuardar: ServicioUnidadSinPaqueteUnidad[]) {
    return this.http.post(`${this.appService.url}cotizador/saveGestionUnidadAccesorioGrupal/${idCotizacion}/${idGrupoUnidad}
    /${idDetalleUnidad}`, serviciosUnidadPorGuardar).pipe(map(res => res));
  }

  //OCT 99 GESTION
  deleteGestionUnidadAccesorioGrupal(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number,
    serviciosUnidadPorGuardar: ServicioUnidadSinPaqueteUnidad[]) {
    return this.http.post(`${this.appService.url}cotizador/deleteGestionUnidadAccesorioGrupal/${idCotizacion}/${idGrupoUnidad}
    /${idDetalleUnidad}`, serviciosUnidadPorGuardar).pipe(map(res => res));
  }

  deleteCotizacionGrupoPaqueteAccesorio(idCotizacion: string, idGrupoUnidad: number, idEncPaqueteAccesorio: number) {
    return this.http
      // tslint:disable-next-line: max-line-length
      .delete(`${this.appService.url}cotizador/deleteCotizacionGrupoPaqueteAccesorio/${idCotizacion}/${idGrupoUnidad}/${idEncPaqueteAccesorio}`)
      .pipe(map(res => res));
  }

  deleteCotizacionGrupoAccesorioSinPaquete(accesorioSinPaquete: AccesorioSinPaquete) {
    return this.http
      .post(`${this.appService.url}cotizador/deleteCotizacionGrupoAccesorioSinPaquete`, accesorioSinPaquete)
      .pipe(map(res => res));
  }

  // deleteCotizacionGrupoConceptoSinPaquete(conceptosSinPaquete: ConceptoSinPaquete) {
  //   return this.http.post(`${this.appService.url}cotizador/deleteCotizacionGrupoConceptoSinPaquete`,
  //   conceptosSinPaquete).pipe(map(res => res));
  // }

  deleteCotizacionGrupoPaqueteServicioUnidad(idCotizacion: string, idGrupoUnidad: number, idEncPaqueteServicioUnidad: number) {
    return this.http
      // tslint:disable-next-line: max-line-length
      .delete(`${this.appService.url}cotizador/deleteCotizacionGrupoPaqueteServicioUnidad/${idCotizacion}/${idGrupoUnidad}/${idEncPaqueteServicioUnidad}`)
      .pipe(map(res => res));
  }

  deleteCotizacionGrupoServicioUnidadSinPaquete(serviciosUnidadSinPaquete: ServicioUnidadSinPaquete) {
    return this.http.post(`${this.appService.url}cotizador/deleteCotizacionGrupoServicioUnidadSinPaquete`,
      serviciosUnidadSinPaquete).pipe(map(res => res));
  }

  deleteCotizacionGrupoPaqueteTramite(idCotizacion: string, idGrupoUnidad: number, idEncPaqueteTramite: number) {
    return this.http
      // tslint:disable-next-line: max-line-length
      .delete(`${this.appService.url}cotizador/deleteCotizacionGrupoPaqueteTramite/${idCotizacion}/${idGrupoUnidad}/${idEncPaqueteTramite}`)
      .pipe(map(res => res));
  }

  deleteCotizacionGrupoTramiteSinPaquete(tramitesSinPaquete: TramiteSinPaquete) {
    return this.http.post(`${this.appService.url}cotizador/deleteCotizacionGrupoTramiteSinPaquete`,
      tramitesSinPaquete).pipe(map(res => res));
  }

  updateCondicionesEntrega(idCotizacion: string, request) {
    return this.http.put(`${this.appService.url}cotizador/condicionesEntrega/${idCotizacion}`, request).pipe(map(res => res));
  }

  getCondicionesEntrega(idCotizacion: string) {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(`${this.appService.url}cotizador/condicionesEntrega/${idCotizacion}`, { headers, responseType: 'text' }
    ).pipe(
      map(res => {
        return res;
      }
      ));
  }

  getUnidadesNuevas(idEmpresa: number, idSucursal: number) {
    return this.http.get(`${this.appService.url}catalogo/inventario/getUnidadesNuevas/${idEmpresa}/${idSucursal}`)
      .pipe(map(res => res));
  }


  getTiposVentas(idSucursal: number, idDireccionFlotillas: string) {
    return this.http.get(`${this.appService.url}catalogo/getTiposVenta/${idSucursal}/${idDireccionFlotillas}`);
  }

  getIvas(idSucursal: number) {
    return this.http.get(`${this.appService.url}catalogo/getIvas/${idSucursal}`);
  }

  clienteFacturacion(requestCliente) {
    if (!requestCliente.idContacto) {
      return from(new Promise<boolean>((resolve, reject) => {
        resolve(true);
      }));
    } else {
      return this.http.post(`${this.appService.url}cotizador/clienteFacturacion`,
      requestCliente).pipe(map(res => res));
    }
  }

  //Utilidad
  getUtilidad(idCotizacion) {
    return this.http.get(`${this.appService.url}cotizador/inventario/getUnidadesNuevas/${idCotizacion}`)
      .pipe(map(res => res));
  }

  //Facturacion Adicionales
  adicionalesFacturacion(requestCliente) {
      return this.http.post(`${this.appService.url}cotizador/adicionalesFacturacion`,
      requestCliente).pipe(map(res => res));
  }


  notificaionEnviada(idCotizacion) {
      return this.http.post(`${this.appService.url}cotizador/notificaionEnviada`,
      {idCotizacion: idCotizacion}).pipe(map(res => res));
  }


  apartarUnidadesGestion(unidadesGestion: UnidadesGestion[]) {
    return this.http.post(`${this.appService.url}cotizador/apartarUnidadesGestion`,
      unidadesGestion).pipe(map(res => res));
  }

  deleteCotizacionUnidadTramite(tramite: TramiteUnidad) {
    return this.http.post(`${this.appService.url}cotizador/deleteCotizacionUnidadTramite`, tramite).pipe(map(res => res));
  }

  deleteStatusProcesadoBpro(request) {
    return this.http.put(`${this.appService.url}cotizador/deleteStatusProcesadoBpro`, request).pipe(map(res => res));
  }

  cancelarStatusProcesadoBpro(request) {
    return this.http.post(`${this.appService.url}pedido/cancelarFacturacionUnidades`, request).pipe(map(res => res));
  }

  consolidacionFlotillasBpro(idCotizacionRequest) {
    return this.http.post(`${this.appService.url}pedido/consolidacionFlotillasBpro`,
     [{idCotizacion: idCotizacionRequest}]).pipe(map(res => res));
  }

  validaOrdenesDeCompra(idCotizacionRequest) {
    return this.http.post(`${this.appService.url}pedido/validaOrdenesDeCompra`,
    [{idCotizacion: idCotizacionRequest}]).pipe(map(res => res));
  }

  verificarEnviadoBpro(idCotizacionValue) {
    return this.http.post(`${this.appService.url}pedido/verificarEnviadoBpro`,
      {idCotizacion: idCotizacionValue}).pipe(map(res => res));
  }

  getStatusDelete(idCotizacion) {
    if (idCotizacion === 'AU-ZM-NZA-UN-5960' || idCotizacion === 'AU-ZM-NZA-UN-5961') {
      return false;
    } else {
      return true;
    }
  }


  getEstatusOrdCompraUnidades(idCotizacion: string, idGrupoUnidad: string, idDetalleUnidad) {
    return this.http.get(`${this.appService.url}cotizador/getEstatusOrdCompraUnidades/${idCotizacion}/${idGrupoUnidad}/${idDetalleUnidad}`);
  }

  statusInstruccionCancelacion(idCotizacion) {
    return this.http.get(`${this.appService.url}pedido/statusInstruccionCancelacion/${idCotizacion}`);
  }

  getUnidadesInteres(idCotizacion: string, idGrupoUnidad: number) {
    return this.http.get(`${this.appService.url}cotizador/conteoGlobalUnidadesInteres/${idCotizacion}/${idGrupoUnidad}`);
  }

  getPedidoBproStatus(idCotizacion) {
    return this.http.get(`${this.appService.url}pedido/getPedidoBproStatus/${idCotizacion}`);
  }

  getOrdenCompraPendientes(idCotizacion) {
    return this.http.get(`${this.appService.url}pedido/validaOrdenesDeCompraPendientes/${idCotizacion}`);
  }

  getEstatusOrdCompraRefacciones(idCotizacion: string, idGrupoUnidad: string, idDetalleUnidad) {
    return this.http.get(
      `${this.appService.url}cotizador/getEstatusOrdCompraRefacciones/${idCotizacion}/${idGrupoUnidad}/${idDetalleUnidad}`);
  }

  getLeyendaFactura(idCotizacion, idUnidad, idDetalleUnidad) {
    return this.http.get(
      `${this.appService.url}cotizador/getLeyendaDetalleUnidad/${idCotizacion}/${idUnidad.idGrupoUnidad}/${idDetalleUnidad}`);
  }

  getLicitiacionBpro(idCotizacion) {
    return this.http.get(`${this.appService.url}pedido/getLicitiacionBpro/${idCotizacion}`);
  }

  saveLeyendaDetalleUnidad(leyenda) {
    return this.http.post(`${this.appService.url}cotizador/saveLeyendaDetalleUnidad`, leyenda).pipe(map(res => res));
  }

  asignarVinDetalleUnidad(vines) {
    return this.http.put(`${this.appService.url}cotizador/asignarVinDetalleUnidad`, vines).pipe(map(res => res));
  }
  //OCT 99
  getValidaRegresaCotizacion(idCotizacion) {
    return this.http.get(
      `${this.appService.url}cotizador/getValidaRegresaCotizacion/${idCotizacion}`);
  }

  //OCT 99
  getRegresaCotizacion(idCotizacion) {
    return this.http.get(
      `${this.appService.url}cotizador/getRegresaCotizacion/${idCotizacion}`);
  }

  //OCT 99 GESTION CANCELA COTIZACION
  getCancelaCotizacion(idCotizacion) {
    return this.http.get(
      `${this.appService.url}cotizador/getCancelaCotizacion/${idCotizacion}`);
  }

  //OCT 99 GESTION CANCELA GRUPO UNIDAD
  getCancelaGrupoUnidad(idCotizacion, idGrupoUnidad) {
    return this.http.get(
      `${this.appService.url}cotizador/getCancelaGrupoUnidad/${idCotizacion}/${idGrupoUnidad}`);
  }

  //OC99 GESTION OBTIENE RESUMEN PRE CANCELACION POR GRUPO
  getResumenPreCancelaGrupoUnidad(idCotizacion, idGrupoUnidad) {
    return this.http.get(
      `${this.appService.url}cotizador/getResumenPreCancelaGrupoUnidad/${idCotizacion}/${idGrupoUnidad}`);
  }

  //OC99 GESTION OBTIENE RESUMEN PRE CANCELACION POR GRUPO
  getResumenPreCancelaCotizacion(idCotizacion) {
    return this.http.get(
      `${this.appService.url}cotizador/getResumenPreCancelaCotizacion/${idCotizacion}`);
  }

  generarPedidoMovBproTraslado(idCotizacionValue) {
    return this.http.post(`${this.appService.url}pedido/cambiaStatusOrdenesDeCompraPendientes`,
     {idCotizacion: idCotizacionValue}).pipe(map(res => res));
  }

  cambiaStatusCotizacionUnidadesPosterior(idCotizacionValue) {
    return this.http.post(`${this.appService.url}pedido/cambiaStatusCotizacionUnidadesPosterior`,
     {idCotizacion: idCotizacionValue}).pipe(map(res => res));
  }

  generacionDePedidoFlotillaBpro(idCotizacionValue, status) {
    return this.http.post(`${this.appService.url}pedido/generacionDePedidoFlotillaBpro`,
     [{ idCotizacion: idCotizacionValue }]).pipe(map(res => res));
  }

  actualizarDePedidoFlotillaBpro(idCotizacionValue) {
    return this.http.post(`${this.appService.url}pedido/actualizarPedido`,
     { idCotizacion: idCotizacionValue }).pipe(map(res => res));
  }

  // OCT 99 20210118 verifica si todas las unidades de la cotizacion ya estan facturadas
  verificaUnidadesFacturadas(idCotizacion) {
    return this.http.get(`${this.appService.url}pedido/verificaUnidadesFacturadas/${idCotizacion}`);
  }

  // OCT 99 20210215 GESTION - Agregar accesorios en Posteriores/Adicionales 1: activa , 0: desactiva
  validaAgregarAccesoriosPostAd(idCotizacion) {
    return this.http.get(`${this.appService.url}pedido/validaAgregarAccesoriosPostAd/${idCotizacion}`);
  }

  // OCT 99 20210118 sino hay OC pendientes, cambia estatus de Cotizacion a ORDENES DE COMPRA COMPLETADAS
  flotillasEvalua(idCotizacionValue) {
    return this.http.get(`${this.appService.url}pedido/flotillasEvalua/${idCotizacionValue}`);
  }
  // OCT 99 20210118 consulta el estatus de la cotizacion
  consultaEstatusCotizacion(idCotizacionValue) {
    return this.http.get(`${this.appService.url}pedido/consultaEstatusCotizacion/${idCotizacionValue}`);
  }

  cancelarServicio(request) {
    return this.http.post(`${this.appService.url}pedido​/cancelacionOrdenesDeServicio`,
     request).pipe(map(res => res));
  }

  cancelarAccesorio(request) {
    return this.http.post(`${this.appService.url}pedido​/cancelacionDeAccesorios`,
    request).pipe(map(res => res));
  }

  cancelarTramite(request) {
    return this.http.post(`${this.appService.url}pedido/cancelacionDeTramites`,
    request).pipe(map(res => res));
  }


  cancelarServicioSinVin(request) {
    return this.http.post(`${this.appService.url}pedido/cancelacionOrdenesDeServicioSinVin`,
     request).pipe(map(res => res));
  }

  cancelarAccesorioSinVin(request) {
    return this.http.post(`${this.appService.url}pedido/cancelacionDeAccesoriosSinVin`,
    request).pipe(map(res => res));
  }

  cancelarTramiteSinVin(request) {
    return this.http.post(`${this.appService.url}pedido/cancelacionDeTramitesSinVin`,
    request).pipe(map(res => res));
  }

  cancelarUnidadesDePedido(request) {
    return this.http.post(`${this.appService.url}pedido/cancelacionDePedidoDeUnidades`,
     request).pipe(map(res => res));
  }

  cancelarUnidadesDePedidoAll(request) {
    return this.http.post(`${this.appService.url}pedido/cancelacionDePedidoDeUnidadesAll`,
     request).pipe(map(res => res));
  }



  cancelarTramiteDePedido(request) {
    return this.http.post(`${this.appService.url}pedido/cancelacionDeTramitesDespuesPedido`,
     request).pipe(map(res => res));
  }

  cancelarServicioDePedido(request) {
    return this.http.post(`${this.appService.url}pedido/cancelacionOrdenesDeServicioDespuesPedido`,
    request).pipe(map(res => res));
  }

  cancelarAccesorioDePedido(request) {
    return this.http.post(`${this.appService.url}pedido/cancelacionDeAccesoriosDespuesPedido`,
    request).pipe(map(res => res));
  }

  cancelarAccesorioDePedidoAdicionales(request) {
    return this.http.post(`${this.appService.url}pedido/cancelarAccesorioDePedidoAdicionales`,
    request).pipe(map(res => res));
  }

  cancelarAccesorioDePedidoPosterior(request) {
    return this.http.post(`${this.appService.url}pedido/cancelarAccesorioDePedidoPosterior`,
    request).pipe(map(res => res));
  }

  sumaTipoCargoUnidad(request) {
    return this.http.post(`${this.appService.url}cotizador/sumaTipoCargoUnidad`,
    request).pipe(map(res => res));
  }

  cancelacionProcesada(idCotizacion) {
    return this.http.get(`${this.appService.url}pedido/cancelacionProcesada/${idCotizacion}`);
  }

  documentosVencidos(idCotizacion , idCliente) {
    return this.http.get(`${this.appService.url}cotizador/documentosVencidos/${idCotizacion}/${idCliente}`);
  }

  creditoLimiteCliente(idCotizacion , idCliente) {
    return this.http.get(`${this.appService.url}cotizador/creditoLimiteCliente/${idCotizacion}/${idCliente}`);
  }

  getBonificacion(sucursal , idCatalogo, modelo) {
    return this.http.get(`${this.appService.url}catalogo/unidad/getBonificacion/${sucursal}/${idCatalogo}/${modelo}`);
  }

  guardaBonificacion(idCotizacion) {
    return this.http.get(`${this.appService.url}catalogo/unidad/guardaBonificacion/${idCotizacion}`);
  }

  actualizarBonificacion(request) {
    return this.http.post(`${this.appService.url}cotizador/actualizarBonificacion`,
    request).pipe(map(res => res));
  }

  actulizarImprimeFactura(request) {
    return this.http.post(`${this.appService.url}cotizador/actulizarImprimeFactura`,
    request).pipe(map(res => res));
  }

  validaDisponibilidadCierreCot(idCotizacion) {
    return this.http.get(`${this.appService.url}cotizador/validaDisponibleCierre/${idCotizacion}`);
  }
  // Cambio P10 - EHJ-COAL
  validaDisponibilidadInventario(idCotizacion,idDireccionFlotillas) {
    return this.http.get(`${this.appService.url}cotizador/validaDisponibilidadInventario/${idCotizacion}/${idDireccionFlotillas}`);
  }

  // Cambio P10 - EHJ-COAL
  validaDisponibilidadInventarioPost(idCotizacion,idDireccionFlotillas) {
    return this.http.get(`${this.appService.url}cotizador/validaDisponibilidadInventarioPost/${idCotizacion}/${idDireccionFlotillas}`);
  }

  // Cambio P10 - EHJ-COAL
  validaDisponibilidadInventarioPostUpdate(idCotizacion,idDireccionFlotillas) {
    return this.http.get(`${this.appService.url}cotizador/validaDisponibilidadInventarioPostUpdate/${idCotizacion}/${idDireccionFlotillas}`);
  }

   // Cambio P10 - EHJ-COAL
   validaDisponibilidadFolio(idCotizacion,idDireccionFlotillas) {
    return this.http.get(`${this.appService.url}cotizador/validaDisponibilidadFolio/${idCotizacion}/${idDireccionFlotillas}`);
  }

   // Cambio P10 - EHJ-COAL
   confirmaCancelacionAccesorio(idCotizacion,idDireccionFlotillas) {
    return this.http.get(`${this.appService.url}cotizador/confirmaCancelacionAccesorio/${idCotizacion}/${idDireccionFlotillas}`);
  }

  // Cambio P07 - EHJ-COAL
   insertaBitacoraUtilidad(idCotizacion,idOpcion) {
    return this.http.get(`${this.appService.url}cotizador/insertaBitacoraUtilidad/${idCotizacion}/${idOpcion}`);
  }

  // Cambio P07 - EHJ-COAL
   insertaBitacoraUtilidadPosteriores(idCotizacion,idOpcion) {
    return this.http.get(`${this.appService.url}cotizador/insertaBitacoraUtilidadPosteriores/${idCotizacion}/${idOpcion}`);
  }

  // Cambio P07 - EHJ-COAL
  insertaBitacoraUtilidadAdicionales(idCotizacion,idOpcion) {
    return this.http.get(`${this.appService.url}cotizador/insertaBitacoraUtilidadAdicionales/${idCotizacion}/${idOpcion}`);
  }

  // Cambio P07 - EHJ-COAL
  validaNotificacionUtilidad(idCotizacion,idOpcion) {
    return this.http.get(`${this.appService.url}cotizador/validaNotificacionUtilidad/${idCotizacion}/${idOpcion}`);
  }

   // Cambio Utilidad Total de la utilidad por vuelta - EHJ-COAL
  obtenTotalUtilidad(idCotizacion,idOpcion) {
    return this.http.get(`${this.appService.url}cotizador/obtenTotalUtilidad/${idCotizacion}/${idOpcion}`);
  }

  validaBotonUtilidad(idUsuario) {
    return this.http.get(`${this.appService.url}cotizador/validaBotonUtilidad/${idUsuario}`);
  }
    // Obtiene Estatus de Notificaciones  - EHJ-COAL
    obtenNotificacion(idCotizacion) {
      return this.http.get(`${this.appService.url}cotizador/obtenNotificacion/${idCotizacion}`);
    }


   // LBM-COAL
   validaPerfiles(idCotizacion) {
    return this.http.get(`${this.appService.url}cotizador/validaPerfiles/${idCotizacion}`);
  }

  // LBM-COAL
  validaTipoOrden(idCotizacion) {
      return this.http.get(`${this.appService.url}cotizador/validaTipoOrden/${idCotizacion}`);
  }

  // LBM-COAL
   validaUnidadFacturada(idCotizacion) {
    return this.http.get(`${this.appService.url}cotizador/validaUnidadFacturada/${idCotizacion}`);
  }

  // LBM-COAL
  validaLimiteCredito(idCotizacion) {
    return this.http.get(`${this.appService.url}cotizador/validaLimiteCredito/${idCotizacion}`);
  }

  status1erNotificacion(idCotizacion) {
    return this.http.get(`${this.appService.url}cotizador/get1erNotificacionCotizacion/${idCotizacion}`);
  }

  udp1erNotificacion(idCotizacion, estatus) {
    return this.http.put(`${this.appService.url}cotizador/udpNotificacionCotizacion1er/${idCotizacion}/${estatus}`, null);
  }

  obtieneMargenUtilidadTraslado(direccionFlotilla) {
    return this.http.get(`${this.appService.url}cotizador/obtieneMargenUtilidadTraslado/${direccionFlotilla}`);
  }

  //SISCO
  // Servicio para validar si en la cotizacion existen accesorios pendientes - SISCO
  validaAccesoriosSisco(idCotizacion: string, origen: number) {
    return this.http.get(`${this.appService.url}cotizador/validaAccesoriosSisco/${idCotizacion}/${origen}`);
  }

  // CHK 23 NOV 2020 - SERVICIO PARA OBTENER EL ID DEL SUSARIO LOGUEADO.
  usuarioCentralizacion(email) {
    // let headers = new Headers();
    const headers = {'username': 'GrupoAndrade', 'password' : '4ndr$d3!'};
    //post data missing(here you pass email and password)
    const data= {
    "correo":  email // 'darinka.galvan@grupoandrade.com'
    }
    return this.http.post('http://192.168.20.89:3200/api/empleado/usuarioCentralizacion',data, {headers}).pipe(map(res => res));
  }

  // CHK 3 FEB 21k - SISCO valida su hay pendientes
  existenSisco(idCotizacion) {
    return this.http.get(`${this.appService.url}cotizador/pendienteSisco/${idCotizacion}`);
  }

  estatusSisco(idCotizacion) {
    return this.http.get(`${this.appService.url}cotizador/estatusSisco/${idCotizacion}`);
  }

  cfdiCliente(idEmpresa,idSucursal,idCliente,idCotizacion) {
    return this.http.get(`${this.appService.url}cotizador/cfdiCliente/${idEmpresa}/${idSucursal}/${idCliente}/${idCotizacion}`);
  }

}

