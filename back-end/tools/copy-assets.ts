import * as shell from 'shelljs';

// Copy all the view templates
shell.cp('-R', 'src/schemas', 'dist');
// Copy ormconfig
shell.cp('ormconfig.json', 'dist');
