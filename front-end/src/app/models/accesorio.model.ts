export interface Accesorio {
  idParte: string;
  nombre: string;
  modeloAnio: string;
  costo: number;
  precio: number;
  existencia: number;
}

export class AccesorioNuevo {
  idCotizacion: string;
  nombre: string;
  idMarca: string;
  idEmpresa: number;
  idSucursal: number;
  idProveedor: number;
  idTipoProveedor: string;
  idAccesorioNuevo: number;
  idGrupoUnidad: number;
  nombreEmpresa: string;
  nombreSucursal: string;
  nombreProveedor: string;
  idParte: string;
  modeloAnio: string;
  costo: number;
  costoO: number; //OCT99 20210112 se agrega para validar costo original de BPRO y permitir edicion en accesorios cotizacion cuando es planta y costo = 0
  cantidad: number;
  precio: number;
  existencia: number;
  idUsuario: number;
  fechaModificacion: Date;
  idDireccionFlotillas: string;
  get esNuevo(): boolean {
    return this.idAccesorioNuevo != undefined;
  }
  get id(): string {
    return this.idAccesorioNuevo == undefined ? this.idParte : this.idAccesorioNuevo.toString();
  }
  Planta: string;
  Origen: string; //OCT99 20210122 se agrego para identificar origen de parte
}

export class DetallePaqueteAccesorios {
  idEncPaqueteAccesorio: number;
  idDetPaqueteAccesorio: number;
  idAccesorioNuevo: number;
  nombre: string;
  idTipoProveedor: string;
  idProveedor: number;
  nombreProveedor: string;
  idParte: string;
  modeloAnio: string;
  cantidad: number;
  costo: number;
  precio: number;
  idUsuario: number;
  fechaModificacion: Date;
  get esNuevo(): boolean {
    return this.idAccesorioNuevo != undefined;
  }
  get id(): string {
    return this.idAccesorioNuevo == undefined ? this.idParte : this.idAccesorioNuevo.toString();
  }
}

export class PaqueteAccesorios {
  idEncPaqueteAccesorio: number;
  nombre: string;
  descripcion: string;
  idMarca: string;
  idEmpresa: number;
  idSucursal: number;
  nombreEmpresa: string;
  nombreSucursal: string;
  idUsuario: number;
  fechaModificacion: Date;
  accesorios: DetallePaqueteAccesorios[];
  isChecked: boolean;
  get precioTotal(): number {
    if (this.accesorios == undefined) {
      return 0.0;
    }
    let suma = 0.0;
    this.accesorios.map(det => {
      suma += det.precio;
    });
    return suma;
  }
  get nombresDetalle(): string {
    if (this.accesorios == undefined) {
      return '';
    }
    let textoDetalle = '';
    this.accesorios.map(det => {
      textoDetalle += '- ' + det.nombre + '\n';
    });
    return textoDetalle;
  }
}

export class AccesorioSinPaquete {
  idCotizacion: string;
  idGrupoUnidad: number;
  idAccesorioNuevo: number;
  nombre: string;
  idTipoProveedor: string;
  idProveedor: number;
  nombreProveedor: string;
  idParte: string;
  modeloAnio: string;
  cantidad: number;
  costo: number;
  precio: number;
  idUsuarioModificacion: number;
  fechaModificacion: Date;
  get esNuevo(): boolean {
    return this.idAccesorioNuevo == -1 || this.idAccesorioNuevo == undefined;
  }
  get id(): string {
    return this.idAccesorioNuevo == -1 || this.idAccesorioNuevo == undefined ? this.idParte : this.idAccesorioNuevo.toString();
  }
  enCompras: number; //SISCO
  observaciones: string; //SISCO
  estatusSolicitud: number; //SISCO
  existencia: number; //SISCO
  nEstatus: string;
}

export class AccesorioNuevoUnidad {
  idCotizacion: string;
  idGrupoUnidad: number;
  idDetalleUnidad: number;
  idAccesorio: string;
  idEncPaqueteAccesorio: number;
  idDetPaqueteAccesorio: number;
  idAccesorioNuevo: number;
  nombre: string;
  idTipoProveedor: string;
  idProveedor: number;
  nombreProveedor: string;
  idParte: string;
  modeloAnio: string;
  cantidad: number;
  costo: number;
  precio: number;
  tipoMovimiento: string;
  idUsuarioModificacion: number;
  fechaModificacion: Date;
}

export class Cantidad {
  cantidad: number;
}
//SISCO
export class SolicitudCotizacionSisco {
  rfcEmpresa: string;
  idCliente: number;
  numeroContrato: string;
  idCentroCosto: number;
  idCentroCostoFolio: string;
  idObjeto: number;
  idTipoObjeto: number;
  idClase: string;
  idTipoSolicitud: string;
  fecha: string;
  Propiedades: string;
  partidas: string;
  partidasNuevas: string;
  comentarios: string;
  idEmpresaBPRO: number;
  idSucursalBPRO: number;
  idAreaBPRO: number;  
  idUsuario:number;
}

export class SolicitudAccesorioSiscoFlotillas {
  idCotizacion: string;
  idAccesorioNuevo: number;
  descripcionParte: string;
  cantidad: number;
  solicitudCotizacion: string;
  modeloAnio: string;
  idUsuario: number;
}
