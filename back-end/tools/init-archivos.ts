import * as fs from 'fs';
import * as path from 'path';

const backupPath = path.join(__dirname, '..', 'archivos');
const archivosPath = path.join(__dirname, '..', 'dist', 'archivos');
if (!fs.existsSync(archivosPath)) {
    if (fs.existsSync(backupPath)) {
        fs.renameSync(backupPath, archivosPath);
    } else {
        fs.mkdirSync(archivosPath);
    }
}
