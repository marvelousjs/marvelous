import * as Case from 'case';
import * as fs from 'fs-extra';
import * as path from 'path';
import zapp from '@zappjs/core';

interface IGenerateOpts {
  path: string;
  specs: any;
}

export function generateHandler(opts: IGenerateOpts) {
  const items = zapp({
    encoders: {},
    files: {
      autoBarrel: {
        filename: `${opts.path}/.auto/index.ts`,
        engine: 'handlebars',
        template: 'autoBarrel'
      },
      tsClient: {
        filename: `${opts.path}/.auto/clients/client.ts`,
        engine: 'handlebars',
        template: 'tsClient',
        mapping: {
          calls: '/interfaces'
        }
      },
      swiftClient: {
        filename: `${opts.path}/.auto/clients/client.swift`,
        engine: 'handlebars',
        template: 'swiftClient',
        mapping: {
          calls: '/interfaces'
        }
      },
      callInterface: {
        filename: {
          engine: 'handlebars',
          template: `${opts.path}/.auto/types/calls/{{{name}}}.types.ts`,
          mapping: {
            name: '@key'
          }
        },
        engine: 'handlebars',
        iterator: '/interfaces',
        template: 'callInterface',
        mapping: {
          interfaces: '@value',
          name: '@key'
        }
      },
      callsBarrel: {
        filename: `${opts.path}/.auto/types/calls/index.ts`,
        engine: 'handlebars',
        template: 'callsBarrel',
        mapping: {
          interfaces: '/interfaces'
        }
      },
      handlerInterface: {
        filename: {
          engine: 'handlebars',
          template: `${opts.path}/.auto/handlers/{{{name}}}.types.ts`,
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
        filename: `${opts.path}/.auto/handlers/index.ts`,
        engine: 'handlebars',
        template: 'handlersBarrel',
        mapping: {
          interfaces: '/interfaces'
        }
      },
      interfacesBarrel: {
        filename: `${opts.path}/.auto/types/index.ts`,
        engine: 'handlebars',
        template: 'interfacesBarrel'
      }
    },
    meta: {},
    schemas: {},
    specs: opts.specs,
    templates: {
      callInterface: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/callInterface.hbs`, 'utf8')
      },
      callsBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/callsBarrel.hbs`, 'utf8')
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

  // console.log(JSON.stringify(items, null, 2));
}

const services = fs.readdirSync('./src/services')
  .filter(service => fs.lstatSync(`./src/services/${service}`).isDirectory())
services.forEach((service) => {
  const interfaces: any = {};
  const items = fs.readdirSync(`./src/services/${service}/calls`)
    .filter(item => !/\.ts$/i.test(item));
  items.forEach((item) => {
    const interfaceObject = require(path.normalize(`${process.cwd()}/src/services/${service}/calls/${item}/${item}.schema`));
    Object.keys(interfaceObject).forEach((key) => {
      const name = Case.camel(key).replace(/Schema$/, '');
      interfaces[name] = interfaceObject[key];
    });
  });

  generateHandler({
    path: `./src/services/${service}`,
    specs: {
      interfaces
    }
  });
});
