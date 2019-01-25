import * as Case from 'case';
import * as fs from 'fs-extra';
import * as path from 'path';
import zapp from '@zappjs/core';

interface IGenerateOpts {
  specs: any;
}

export function generateHandler(opts: IGenerateOpts) {
  const items = zapp({
    encoders: {},
    files: {
      tsClient: {
        filename: 'src/clients/client.ts',
        engine: 'handlebars',
        template: 'tsClient',
        mapping: {
          functions: '/interfaces'
        }
      },
      swiftClient: {
        filename: 'src/clients/client.swift',
        engine: 'handlebars',
        template: 'swiftClient',
        mapping: {
          functions: '/interfaces'
        }
      },
      appInterface: {
        filename: 'src/types/app.ts',
        engine: 'handlebars',
        template: 'appInterface',
        mapping: {
          interfaces: '/interfaces'
        }
      },
      functionInterface: {
        filename: {
          engine: 'handlebars',
          template: 'src/types/functions/{{{name}}}.ts',
          mapping: {
            name: '@key'
          }
        },
        engine: 'handlebars',
        iterator: '/interfaces',
        template: 'functionInterface',
        mapping: {
          interfaces: '@value',
          name: '@key'
        }
      },
      functionsBarrel: {
        filename: 'src/types/functions/index.ts',
        engine: 'handlebars',
        template: 'functionsBarrel',
        mapping: {
          interfaces: '/interfaces'
        }
      },
      interfacesBarrel: {
        filename: 'src/types/index.ts',
        engine: 'handlebars',
        template: 'interfacesBarrel'
      }
    },
    meta: {},
    schemas: {},
    specs: opts.specs,
    templates: {
      appInterface: {
        template: fs.readFileSync(`${__dirname}/../../src/bin/templates/appInterface.hbs`, 'utf8')
      },
      functionInterface: {
        template: fs.readFileSync(`${__dirname}/../../src/bin/templates/functionInterface.hbs`, 'utf8')
      },
      functionsBarrel: {
        template: fs.readFileSync(`${__dirname}/../../src/bin/templates/functionsBarrel.hbs`, 'utf8')
      },
      interfacesBarrel: {
        template: fs.readFileSync(`${__dirname}/../../src/bin/templates/interfacesBarrel.hbs`, 'utf8')
      },
      swiftClient: {
        template: fs.readFileSync(`${__dirname}/../../src/bin/templates/swiftClient.hbs`, 'utf8')
      },
      tsClient: {
        template: fs.readFileSync(`${__dirname}/../../src/bin/templates/tsClient.hbs`, 'utf8')
      }
    }
  });

  items.forEach((item) => {
    const parentPath = path.dirname(item.path);
    if (!fs.existsSync(parentPath)) {
      fs.mkdirpSync(parentPath);
    }
    fs.writeFileSync(item.path, item.content);
  });

  console.log(JSON.stringify(items, null, 2));
}

const interfaces: any = {};
const items = fs.readdirSync('./src/schemas')
  .filter(item => /\.schema\.ts$/i.test(item));
items.forEach((item) => {
  const interfaceObject = require(path.normalize(`${process.cwd()}/src/schemas/${item}`));
  Object.keys(interfaceObject).forEach((key) => {
    const name = Case.camel(key).replace(/schema$/i, '');
    interfaces[name] = interfaceObject[key];
  });
});

generateHandler({
  specs: {
    interfaces
  }
});