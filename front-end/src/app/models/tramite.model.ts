export interface Tramite {
  idTramite: string;
  nombre: string;
}

export interface Subtramite {
  idSubtramite: string;
  nombre: string;
}

export interface ProductoCFDI {
  VALUE: string;
  TEXT: string;
}

export class DetallePaqueteTramite {
  idEncPaqueteTramite: number;
  idTramite: string;
  idSubtramite: string;
  idProveedor: number;
  nombreTramite: string;
  nombreSubtramite: string;
  nombreProveedor: string;
  costo: number;
  precio: number;
  idUsuarioModificacion: number;
  fechaModificacion: Date;
}

export class PaqueteTramite {
  constructor() { }
  idEncPaqueteTramite: number;
  nombre: string;
  descripcion: string;
  idMarca: string;
  idEmpresa: number;
  idSucursal: number;
  nombreEmpresa: string;
  nombreSucursal: string;
  idUsuarioModificacion: number;
  fechaModificacion: Date;
  isSelected: boolean;
  tramites: DetallePaqueteTramite[];
  get precioTotal(): number {
    if (this.tramites == undefined) {
      return 0.0;
    }
    let suma = 0.0;
    this.tramites.map(det => {
      suma += det.precio;
    });
    return suma;
  }
  get nombresDetalle(): string {
    if (this.tramites == undefined) {
      return '';
    }
    let textoDetalle = '';
    this.tramites.map(det => {
      textoDetalle += '- ' + det.nombreSubtramite + '\n';
    });
    return textoDetalle;
  }

}

export class TramiteUnidad {
  idCotizacion: string;
  idGrupoUnidad: number;
  idDetalleUnidad: number;
  idEncPaqueteTramite: number;
  idTramite: string;
  idSubtramite: string;
  idProveedor: number;
  nombreTramite: string;
  nombreSubtramite: string;
  nombreProveedor: string;
  costo: number;
  precio: number;
  tipoMovimiento: string;
  idUsuarioModificacion: number;
  fechaModificacion: Date;
  procesado: number;
}

export class TramiteUnidadFac {
  idCotizacion: string;
  idGrupoUnidad: number;
  idDetalleUnidad: number;
  idTramite: string;
  idSubtramite: string;
  precio: number;
  datosFac: string;
  idUsuarioModificacion: number
}

export class TrasladoUnidadFac {
  idCotizacionTraslado: number;
  idCotizacion: string;
  idGrupoUnidad: number;
  idTraslado: number;
  datosFac: string;
  idUsuarioModificacion: number
}

export class TramiteSinPaquete {
  idCotizacion: string;
  idGrupoUnidad: number;
  idTramite: string;
  idSubtramite: string;
  idProveedor: number;
  nombreTramite: string;
  nombreSubtramite: string;
  nombreProveedor: string;
  costo: number;
  precio: number;
  idUsuarioModificacion: number;
  fechaModificacion: Date;


  public get id(): string {
    return this.idTramite || '' + ' - ' + this.idSubtramite || '';
  }


  public get proveedorConId(): string {
    return (this.idProveedor || 0).toString() + ' - ' + this.nombreProveedor || '';
  }


}
