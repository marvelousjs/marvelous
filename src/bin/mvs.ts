import * as Case from 'case';
import * as fs from 'fs-extra';
import * as path from 'path';
import zapp from '@zappjs/core';

interface IGenerateOpts {
  path: string;
  specs: any;
  type: string;
}

export function generateHandler(opts: IGenerateOpts) {
  const files = opts.type === 'gateway' ? {
    autoBarrel: {
      filename: `${opts.path}/.auto/index.ts`,
      engine: 'handlebars',
      template: 'gatewayAutoBarrel'
    },
    tsClient: {
      filename: `${opts.path}/.auto/clients/client.ts`,
      engine: 'handlebars',
      template: 'gatewayTsClient',
      mapping: {
        operations: '/interfaces'
      }
    },
    swiftClient: {
      filename: `${opts.path}/.auto/clients/client.swift`,
      engine: 'handlebars',
      template: 'gatewaySwiftClient',
      mapping: {
        operations: '/interfaces'
      }
    },
    operationInterface: {
      filename: {
        engine: 'handlebars',
        template: `${opts.path}/.auto/types/operations/{{{name}}}.types.ts`,
        mapping: {
          name: '@key'
        }
      },
      engine: 'handlebars',
      iterator: '/interfaces',
      template: 'gatewayOperationInterface',
      mapping: {
        interfaces: '@value',
        name: '@key'
      }
    },
    operationsBarrel: {
      filename: `${opts.path}/.auto/types/operations/index.ts`,
      engine: 'handlebars',
      template: 'gatewayOperationsBarrel',
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
      template: 'gatewayHandlerInterface',
      mapping: {
        interfaces: '@value',
        name: '@key'
      }
    },
    handlersBarrel: {
      filename: `${opts.path}/.auto/handlers/index.ts`,
      engine: 'handlebars',
      template: 'gatewayHandlersBarrel',
      mapping: {
        interfaces: '/interfaces'
      }
    },
    interfacesBarrel: {
      filename: `${opts.path}/.auto/types/index.ts`,
      engine: 'handlebars',
      template: 'gatewayInterfacesBarrel'
    }
  } : {
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
  };

  const items = zapp({
    encoders: {},
    files,
    meta: {},
    schemas: {},
    specs: opts.specs,
    templates: {
      callInterface: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/service/callInterface.hbs`, 'utf8')
      },
      callsBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/service/callsBarrel.hbs`, 'utf8')
      },
      autoBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/service/autoBarrel.hbs`, 'utf8')
      },
      handlerInterface: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/service/handlerInterface.hbs`, 'utf8')
      },
      handlersBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/service/handlersBarrel.hbs`, 'utf8')
      },
      interfacesBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/service/interfacesBarrel.hbs`, 'utf8')
      },
      swiftClient: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/service/swiftClient.hbs`, 'utf8')
      },
      tsClient: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/service/tsClient.hbs`, 'utf8')
      },
      gatewayOperationInterface: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/operationInterface.hbs`, 'utf8')
      },
      gatewayOperationsBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/operationsBarrel.hbs`, 'utf8')
      },
      gatewayAutoBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/autoBarrel.hbs`, 'utf8')
      },
      gatewayHandlerInterface: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/handlerInterface.hbs`, 'utf8')
      },
      gatewayHandlersBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/handlersBarrel.hbs`, 'utf8')
      },
      gatewayInterfacesBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/interfacesBarrel.hbs`, 'utf8')
      },
      gatewaySwiftClient: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/swiftClient.hbs`, 'utf8')
      },
      gatewayTsClient: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/tsClient.hbs`, 'utf8')
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

const gateways = fs.readdirSync('./src/gateways')
  .filter(gateway => fs.lstatSync(`./src/gateways/${gateway}`).isDirectory());
gateways.forEach((gateway) => {
  const interfaces: any = {};
  const gatewayOperations = fs.readdirSync(`./src/gateways/${gateway}/operations`)
    .filter(gatewayOperation => !/\.ts$/i.test(gatewayOperation));
  gatewayOperations.forEach((gatewayOperation) => {
    const methods = fs.readdirSync(`./src/gateways/${gateway}/operations/${gatewayOperation}`)
      .filter(method => !/\.ts$/i.test(method));
    methods.forEach((method) => {
      const interfaceObject = require(path.normalize(`${process.cwd()}/src/gateways/${gateway}/operations/${gatewayOperation}/${method}/${method}.schema`));
      Object.keys(interfaceObject).forEach((key) => {
        const name = Case.camel(key).replace(/Schema$/, '');
        interfaces[name] = interfaceObject[key];
      });
    });
  });

  generateHandler({
    type: 'gateway',
    path: `./src/gateways/${gateway}`,
    specs: {
      interfaces
    }
  });
});

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
    type: 'service',
    path: `./src/services/${service}`,
    specs: {
      interfaces
    }
  });
});
