export interface Cliente {
    apellidoMaterno: string;
    apellidoPaterno: string;
    calle: string;
    celular: string;
    ciudad: string;
    codigoPostal: string;
    colonia: string;
    correo: string;
    curp: string;
    estado: string;
    estatus: string;
    extension: string;
    extensionAlternativo: string;
    idCliente: number;
    municipioAlcaldia: string;
    nombreCompleto: string;
    numeroExterior: string;
    numeroInterior: string;
    pais: string;
    rfc: string;
    telefono: string;
    telefonoAlternativo: string;
    tipoBase: string;
    tipoMoral: string;
    tipoPersona: string;
    direccionesCFDIAccesorios: CFDIAccesorios[];
    direccionesCFDIUnidades: CFDIUnidades[];
    direccionesFlotillas: DireccionesFlotillas[];
}

export interface CFDIAccesorios {
    idCfdi: string;
    nombre: string;
}

export interface CFDIUnidades {
    idCfdi: string;
    nombre: string;
}

export interface DireccionesFlotillas {
    idDireccionFlotillas: string;
    nombre: string;
}
