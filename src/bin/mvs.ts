import * as fs from 'fs';
import * as path from 'path';
import * as sane from 'sane';

import { generateClient } from './mvs-generate-client';
import { generateTypes } from './mvs-generate-types';

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'));

console.log(`mvs v${pkg.version}`);

if (process.argv[2] !== 'generate' || ['all', 'client', 'types'].indexOf(process.argv[3]) === -1) {
  console.log('Usage: mvs generate <all|client|types>');
  process.exit(0);
}

const generate = () => {
  if (process.argv[3] === 'types' || process.argv[3] === 'all') {
    console.log('Generating types...');
    generateTypes();
    console.log('Done');
  }
  if (process.argv[3] === 'client' || process.argv[3] === 'all') {
    console.log('Generating client...');
    generateClient();
    console.log('Done');
  }
};

if (process.argv[4] === '-w') {
  const watch = sane('src', { glob: ['**/*.schema.ts'] });
  watch.on('change', async () => {
    generate();
  });
} else {
  generate();
}