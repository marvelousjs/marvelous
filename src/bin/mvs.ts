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
      autoBarrel: {
        filename: 'src/.auto/index.ts',
        engine: 'handlebars',
        template: 'autoBarrel'
      },
      tsClient: {
        filename: 'src/.auto/clients/client.ts',
        engine: 'handlebars',
        template: 'tsClient',
        mapping: {
          actions: '/interfaces'
        }
      },
      swiftClient: {
        filename: 'src/.auto/clients/client.swift',
        engine: 'handlebars',
        template: 'swiftClient',
        mapping: {
          actions: '/interfaces'
        }
      },
      actionInterface: {
        filename: {
          engine: 'handlebars',
          template: 'src/.auto/types/actions/{{{name}}}.types.ts',
          mapping: {
            name: '@key'
          }
        },
        engine: 'handlebars',
        iterator: '/interfaces',
        template: 'actionInterface',
        mapping: {
          interfaces: '@value',
          name: '@key'
        }
      },
      actionsBarrel: {
        filename: 'src/.auto/types/actions/index.ts',
        engine: 'handlebars',
        template: 'actionsBarrel',
        mapping: {
          interfaces: '/interfaces'
        }
      },
      handlerInterface: {
        filename: {
          engine: 'handlebars',
          template: 'src/.auto/handlers/{{{name}}}.types.ts',
          mapping: {
            name: '@key'
          }
        },
        engine: 'handlebars',
        iterator: '/interfaces',
        template: 'handlerInterface',
        mapping: {
          interfaces: '@value',
          name: '@key'
        }
      },
      handlersBarrel: {
        filename: 'src/.auto/handlers/index.ts',
        engine: 'handlebars',
        template: 'handlersBarrel',
        mapping: {
          interfaces: '/interfaces'
        }
      },
      interfacesBarrel: {
        filename: 'src/.auto/types/index.ts',
        engine: 'handlebars',
        template: 'interfacesBarrel'
      }
    },
    meta: {},
    schemas: {},
    specs: opts.specs,
    templates: {
      actionInterface: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/actionInterface.hbs`, 'utf8')
      },
      actionsBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/actionsBarrel.hbs`, 'utf8')
      },
      autoBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/autoBarrel.hbs`, 'utf8')
      },
      handlerInterface: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/handlerInterface.hbs`, 'utf8')
      },
      handlersBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/handlersBarrel.hbs`, 'utf8')
      },
      interfacesBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/interfacesBarrel.hbs`, 'utf8')
      },
      swiftClient: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/swiftClient.hbs`, 'utf8')
      },
      tsClient: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/tsClient.hbs`, 'utf8')
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