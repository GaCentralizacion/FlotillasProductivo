"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { SeguridadBusiness } from '../business';
exports.checkServicePermission = () => {
    return (req, res, next) => {
        next();
        // Obtiene el id de usuario del header Authorizacion (checkJwt)
        // const id = (res.locals.jwtPayload as { idUsuario: number; usuario: string })
        //   .idUsuario;
        // const seguridadBusiness = new SeguridadBusiness();
        // seguridadBusiness.checkServicePermission(id, req.url).then((rolValido) => {
        //   if (rolValido) {
        //     next();
        //   } else {
        //     res.status(401).send('Usuario no autorizado');
        //   }
        // }, (error) => {
        //   res.status(500).json(error);
        // });
    };
};
//# sourceMappingURL=checkServicePermission.js.map