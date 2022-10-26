import { getConnection } from 'typeorm';
import { Usuario } from '../../db/model/seguridad';

export class SeguridadBusiness {
    getUsuario(idUsuario: number) {
        return new Promise<Usuario>(async (resolve, reject) => {
            const connection = getConnection();
            connection.manager.findOne(Usuario, { idUsuario }).then(async (usuario: Usuario) => {
                resolve(usuario);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    getAllUsuarios() {
        return new Promise<Usuario[]>(async (resolve, reject) => {
            const connection = getConnection();
            connection.manager.find(Usuario).then(async (usuarios: Usuario[]) => {
                resolve(usuarios);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }
}
