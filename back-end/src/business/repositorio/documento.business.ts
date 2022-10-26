import * as find from 'find';
import * as fs from 'fs';
import * as path from 'path';
export class DocumentoBusiness {

    private _archivosPath = path.join(__dirname, '../../archivos/');

    constructor(folder: string) {
        this._archivosPath = path.join(this._archivosPath, folder + '/');
        if (!fs.existsSync(this._archivosPath)) {
            fs.mkdirSync(this._archivosPath, { recursive: true });
        }
    }

    get(filePath: string): Promise<string> {
        filePath = path.join(this._archivosPath, filePath);
        return new Promise<string>((resolve, reject) => {
            fs.readFile(filePath, { encoding: 'utf8' }, (error, fileBase64) => {
                if (error) {
                    resolve(null);
                }
                resolve(fileBase64);
            });
        });
    }

    set(filePath: string, base64: string): Promise<boolean> {
        filePath = path.join(this._archivosPath, filePath);
        return new Promise<boolean>(async (resolve, reject) => {
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
        });
    }

    delete(filePath: string): Promise<boolean> {
        filePath = path.join(this._archivosPath, filePath);
        return new Promise<boolean>((resolve, reject) => {
            if (!fs.existsSync(filePath)) {
                resolve(false);
            } else {
                try {
                    fs.unlinkSync(filePath);
                    resolve(true);
                } catch (err) {
                    resolve(false);
                }
            }
        });
    }

    getFileNames(filePath: string): Promise<string[]> {
        filePath = path.join(this._archivosPath, filePath);
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(filePath, (error, files) => {
                if (error) {
                    reject(error);
                }
                resolve(files);
            });
        });

    }

    find(text: string): Promise<string[]> {
        const regExp = new RegExp(text, 'ig');
        return new Promise<string[]>((resolve, reject) => {
            find.file(regExp, this._archivosPath, (filePaths: string[]) => {
                const retorno = [];
                for (const filePath of filePaths) {
                    retorno.push(filePath.replace(this._archivosPath, ''));
                }
                resolve(retorno);
            });
        });
    }
}
