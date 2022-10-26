import { NextFunction, Request, Response } from 'express';

// import { SeguridadBusiness } from '../business';

export const checkServicePermission = () => {
  return (req: Request, res: Response, next: NextFunction) => {
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
