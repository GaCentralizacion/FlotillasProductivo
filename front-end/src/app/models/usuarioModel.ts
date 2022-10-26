export interface Usuario {
    idUsuario: number,
    userName: string,
    nombreCompleto: string,
    email: string,
    celular: string,
    fechaRegistro: string,
    ultimoLogin: string
}

export class Usuarios {
  idUsuario: number;
  userName: string;
  nombreCompleto: string;
  email: string;
  celular: string;
  fechaRegistro: string;
  ultimoLogin: string;
}
