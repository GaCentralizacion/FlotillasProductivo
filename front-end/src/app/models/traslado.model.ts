import { UbicacionTraslado } from './ubicacionTraslado.model';

export interface Traslado {
  idTraslado: number;
  idUbicacionOrigen: number;
  idUbicacionDestino: number;
  idMarca: string;
  idEmpresa: number;
  idSucursal: number;
  idProveedor: number;
  nombreProveedor: string;
  costoUnitario: number;
  precioUnitario: number;
  ubicacionOrigen: UbicacionTraslado;
  ubicacionDestino: UbicacionTraslado;
  utilidadTotal: number;
  activo: boolean;
}
