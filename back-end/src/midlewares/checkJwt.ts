import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
dotenv.config();

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  // Se obtiene el token jwt del header
  const authHeader = req.headers['authorization'] as string;
  if (authHeader == undefined) {
    res.status(401).send('Se requiere header [\'Authorization\']: Bearer token');
  }
  const tokenArray = authHeader.split(' ');
  if (tokenArray.length != 2 || tokenArray[0].toUpperCase() != 'BEARER') {
    res.status(401).send('Se requiere header [\'Authorization\']: Bearer token');
  }
  const token = tokenArray[1];
  const jwtSecret = process.env.JWT_SECRET;
  const expirationSeconds = Number(process.env.JWT_EXPIRATION);
  let jwtPayload;

  // Se valida el token
  try {
    jwtPayload = jwt.verify(token, jwtSecret) as any;
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    // Si el token es inválido, se responde 401 (unauthorized)
    res.status(401).send('Token inválido');
    return;
  }

  // Se envía un nuevo token al cliente
  const { idUsuario, usuario } = jwtPayload;
  const newToken = jwt.sign({ idUsuario, usuario }, jwtSecret, {
    expiresIn: expirationSeconds,
  });
  res.setHeader('token', newToken);

  // Se llama al siguiente midleware
  next();
};
