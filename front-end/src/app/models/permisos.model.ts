export interface Permiso {
    columns: any[];
    id: number;
    authorized: boolean;
    type: number;
    caption: string;
    name: string;
    father: number;
}

export interface Modulo {
    objects: Permiso[];
    id: number;
    authorized: boolean;
    type: number;
    caption: string;
    name: string;
    father?: any;
    key?: any;
}

export interface Permisos {
    modules: Modulo[];
    count: number;
}
