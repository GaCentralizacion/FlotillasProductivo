export interface TipoProveedor {
  idTipoProveedor: string;
  nombre: string;
}

export class IdTiposProveedor {
  idTipoProveedor: string;
}

export class Proveedor {
  idProveedor: number;
  nombreCompleto: string;
  rfc: string;
  calle: string;
  colonia: string;
  numeroExterior: string;
  numeroInterior: string;
  municipioAlcaldia: string;
  correo: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  telefono: string;
  extension: string;
  telefonoAlternativo: string;
  celular: string;
  idTipoProveedor: string;
  tipoProveedor: string;
  nombreIdProveedor: string;
}
