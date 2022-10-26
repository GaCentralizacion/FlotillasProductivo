export class DetallePaqueteServicio {
  idEncPaqueteServicioUnidad: number;
  idServicioUnidad: string;
  catalogo: string;
  anio: string;
  nombre: string;
  descripcion: string;
  costo: number;
  precio: number;
  idUsuarioModificacion: number;
  fechaModificacion: Date;
}

export class PaqueteServicio {
  idEncPaqueteServicioUnidad: number;
  nombre: string;
  descripcion: string;
  idMarca: string;
  idEmpresa: number;
  idSucursal: number;
  nombreEmpresa: string;
  nombreSucursal: string;
  catalogo: string;
  anio: string;
  idUsuarioModificacion: number;
  fechaModificacion: Date;
  serviciosUnidad: DetallePaqueteServicio[];
  isSelected: boolean;
  get precioTotal(): number {
    if (this.serviciosUnidad == undefined) {
      return 0.0;
    }
    let suma = 0.0;
    this.serviciosUnidad.map(det => {
      suma += det.precio;
    });
    return suma;
  }
  get nombresDetalle(): string {
    if (this.serviciosUnidad == undefined) {
      return '';
    }
    let textoDetalle = '';
    this.serviciosUnidad.map(det => {
      textoDetalle += '- ' + det.nombre + '\n';
    });
    return textoDetalle;
  }
}

export interface ServicioUnidad {
  catalogo: string;
  anio: string;
  idServicioUnidad: string;
  nombre: string;
  descripcion: string;
  costo: 0;
  precio: 0;
  isSelected: boolean;
}

export class ServicioUnidadSinPaquete {
  idCotizacion: string;
  idGrupoUnidad: number;
  idServicioUnidad: string;
  catalogo: string;
  anio: string;
  nombre: string;
  descripcion: string;
  costo: number;
  precio: number;
  idUsuarioModificacion: number;
  fechaModificacion: Date;
}

export class ServicioUnidadSinPaqueteUnidad {

  idCotizacion: string;
  idGrupoUnidad: number;
  idDetalleUnidad: number;
  idEncPaqueteServicioUnidad: number;
  idServicioUnidad: string;
  catalogo: string;
  anio: string;
  nombre: string;
  descripcion: string;
  costo: number;
  precio: number;
  tipoMovimiento: string;
  idUsuarioModificacion: number;
  fechaModificacion: Date;

}
