"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const find = __importStar(require("find"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class DocumentoBusiness {
    constructor(folder) {
        this._archivosPath = path.join(__dirname, '../../archivos/');
        this._archivosPath = path.join(this._archivosPath, folder + '/');
        if (!fs.existsSync(this._archivosPath)) {
            fs.mkdirSync(this._archivosPath, { recursive: true });
        }
    }
    get(filePath) {
        filePath = path.join(this._archivosPath, filePath);
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, { encoding: 'utf8' }, (error, fileBase64) => {
                if (error) {
                    resolve(null);
                }
                resolve(fileBase64);
            });
        });
    }
    set(filePath, base64) {
        filePath = path.join(this._archivosPath, filePath);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(path.dirname(filePath))) {
                fs.mkdirSync(path.dirname(filePath), { recursive: true });
            }
            fs.writeFile(filePath, Buffer.from(base64.split(';base64,').pop(), 'base64'), 'utf8', (error) => {
                if (error) {
                    console.log(error, '¿ERROR?');
                    reject(error);
                }
                resolve(true);
                console.log('File generated');
            });
        }));
    }
    delete(filePath) {
        filePath = path.join(this._archivosPath, filePath);
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(filePath)) {
                resolve(false);
            }
            else {
                try {
                    fs.unlinkSync(filePath);
                    resolve(true);
                }
                catch (err) {
                    resolve(false);
                }
            }
        });
    }
    getFileNames(filePath) {
        filePath = path.join(this._archivosPath, filePath);
        return new Promise((resolve, reject) => {
            fs.readdir(filePath, (error, files) => {
                if (error) {
                    reject(error);
                }
                resolve(files);
            });
        });
    }
    find(text) {
        const regExp = new RegExp(text, 'ig');
        return new Promise((resolve, reject) => {
            find.file(regExp, this._archivosPath, (filePaths) => {
                const retorno = [];
                for (const filePath of filePaths) {
                    retorno.push(filePath.replace(this._archivosPath, ''));
                }
                resolve(retorno);
            });
        });
    }
}
exports.DocumentoBusiness = DocumentoBusiness;
//# sourceMappingURL=documento.business.js.map