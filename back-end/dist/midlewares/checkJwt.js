"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jwt = __importStar(require("jsonwebtoken"));
dotenv_1.default.config();
exports.checkJwt = (req, res, next) => {
    // Se obtiene el token jwt del header
    const authHeader = req.headers['authorization'];
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
        jwtPayload = jwt.verify(token, jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    }
    catch (error) {
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
//# sourceMappingURL=checkJwt.js.map