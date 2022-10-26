import dotenv from 'dotenv';
import * as fs from 'fs';
import * as ip from 'ip';
import * as shell from 'shelljs';

dotenv.config();

const port = Number(process.env.SERVER_PORT);

const firstIp = ip.address() || 'localhost';

const schemaRaw = fs.readFileSync('dist/swagger.json', 'utf8');
const swaggerSchema = JSON.parse(schemaRaw.toString());
const serviceCount = Object.keys(swaggerSchema.paths).length.toString();

// Replace localhost in swagger
shell.sed(
  '-i',
  '{{serviceCount}}',
  serviceCount,
  'dist/swagger.json',
);
shell.sed(
  '-i',
  'ref": "/',
  'ref": "http://' + firstIp + ':' + port + '/',
  'dist/swagger.json',
);
shell.sed(
  '-i',
  '"host": "/"',
  '"host": "' + firstIp + ':' + port + '"',
  'dist/swagger.json',
);
shell.find('dist/schemas').filter((filePath) => {
  if (filePath.endsWith('schema.json')) {
    shell.sed(
      '-i',
      'ref": "',
      'ref": "\.\/',
      filePath,
    );
  }
});
