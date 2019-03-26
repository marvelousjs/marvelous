import * as fs from 'fs';
import * as path from 'path';

import { generateClient } from './mvs-generate-client';
import { generateTypes } from './mvs-generate-types';

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'));

console.log(`mvs v${pkg.version}`);

if (process.argv[2] !== 'generate' || ['client', 'types'].indexOf(process.argv[3]) === -1) {
  console.log('Usage: mvs generate <client|types>');
  process.exit(0);
}

if (process.argv[3] === 'client') {
  console.log('Generating client...');
  generateClient();
} else if (process.argv[3] === 'types') {
  console.log('Generating types...');
  generateTypes();
}
