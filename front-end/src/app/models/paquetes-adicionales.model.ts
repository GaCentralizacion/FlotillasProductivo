export class DetallePaqueteAdicionales {
    idEncPaqueteConcepto: number;
    idConcepto: string;
    nombreConcepto: string;
    idUnidadMedida: string;
    nombreUnidadMedida: string;
    nombre: string;
    costo: number;
    precio: number;
    idUsuarioModificacion: number;
    fechaModificacion: Date;
}

export class PaquetesAdicionales {
    constructor() { }
    idEncPaqueteConcepto: string;
    nombre: string;
    descripcion: string;
    idMarca: string;
    idEmpresa: number;
    idSucursal: number;
    nombreEmpresa: string;
    nombreSucursal: string;
    idUsuarioModificacion: number;
    fechaModificacion: Date;
    conceptos: DetallePaqueteAdicionales[];
    get precioTotal(): number {
      if (this.conceptos == undefined) {
        return 0.0;
      }
      let suma = 0.0;
      this.conceptos.map(det => {
        suma += det.precio;
      });
      return suma;
    }
    get nombresDetalle(): string {
      if (this.conceptos == undefined) {
        return '';
      }
      let textoDetalle = '';
      this.conceptos.map(det => {
        textoDetalle += '- ' + det.nombreConcepto + '\n';
      });
      return textoDetalle;
    }
}

export interface UnidadMedida {
    idUnidadMedida: string;
    nombre: string;
}
