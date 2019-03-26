import { generateClient } from './mvs-generate-client';
import { generateTypes } from './mvs-generate-types';

if (process.argv[2] === 'client') {
  generateClient();
} else {
  generateTypes();
}
