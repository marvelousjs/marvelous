import * as Case from 'case';
import * as fs from 'fs-extra';
import * as path from 'path';
import zapp from '@zappjs/core';

interface IGenerateOpts {
  packageName: string;
  name: string,
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
      filename: `${opts.path}/.auto/clients/src/${Case.pascal(opts.name)}GatewayClient.ts`,
      engine: 'handlebars',
      template: 'gatewayTsClient',
      mapping: {
        gatewayName: opts.name,
        routes: '/interfaces'
      }
    },
    clientIndex: {
      filename: `${opts.path}/.auto/clients/src/index.ts`,
      engine: 'handlebars',
      template: 'gatewayClientIndex',
      mapping: {
        name: opts.name
      }
    },
    clientPackage: {
      filename: `${opts.path}/.auto/clients/package.json`,
      engine: 'handlebars',
      template: 'gatewayClientPackage',
      mapping: {
        packageName: opts.packageName
      }
    },
    clientTsConfig: {
      filename: `${opts.path}/.auto/clients/tsconfig.json`,
      engine: 'handlebars',
      template: 'gatewayClientTsConfig'
    },
    // swiftClient: {
    //   filename: `${opts.path}/.auto/clients/${Case.pascal(opts.name)}GatewayClient.swift`,
    //   engine: 'handlebars',
    //   template: 'gatewaySwiftClient',
    //   mapping: {
    //     routes: '/interfaces'
    //   }
    // },
    routeInterface: {
      filename: {
        engine: 'handlebars',
        template: `${opts.path}/.auto/types/routes/{{{name}}}.types.ts`,
        mapping: {
          name: '@key'
        }
      },
      engine: 'handlebars',
      iterator: '/interfaces',
      template: 'gatewayRouteInterface',
      mapping: {
        route: '@value',
        name: '@key'
      }
    },
    routesBarrel: {
      filename: `${opts.path}/.auto/types/routes/index.ts`,
      engine: 'handlebars',
      template: 'gatewayRoutesBarrel',
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
      filename: `${opts.path}/.auto/clients/src/${Case.pascal(opts.name)}ServiceClient.ts`,
      engine: 'handlebars',
      template: 'tsClient',
      mapping: {
        serviceName: opts.name,
        calls: '/interfaces'
      }
    },
    clientIndex: {
      filename: `${opts.path}/.auto/clients/src/index.ts`,
      engine: 'handlebars',
      template: 'serviceClientIndex',
      mapping: {
        name: opts.name
      }
    },
    clientPackage: {
      filename: `${opts.path}/.auto/clients/package.json`,
      engine: 'handlebars',
      template: 'serviceClientPackage',
      mapping: {
        packageName: opts.packageName
      }
    },
    clientTsConfig: {
      filename: `${opts.path}/.auto/clients/tsconfig.json`,
      engine: 'handlebars',
      template: 'serviceClientTsConfig'
    },
    // swiftClient: {
    //   filename: `${opts.path}/.auto/clients/${Case.pascal(opts.name)}ServiceClient.swift`,
    //   engine: 'handlebars',
    //   template: 'swiftClient',
    //   mapping: {
    //     calls: '/interfaces'
    //   }
    // },
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
      // swiftClient: {
      //   template: fs.readFileSync(`${__dirname}/../../bin/templates/service/swiftClient.hbs`, 'utf8')
      // },
      tsClient: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/service/tsClient.hbs`, 'utf8')
      },
      serviceClientIndex: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/service/clientIndex.hbs`, 'utf8')
      },
      serviceClientPackage: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/service/clientPackage.hbs`, 'utf8')
      },
      serviceClientTsConfig: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/service/clientTsConfig.hbs`, 'utf8')
      },
      gatewayRouteInterface: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/routeInterface.hbs`, 'utf8')
      },
      gatewayRoutesBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/routesBarrel.hbs`, 'utf8')
      },
      gatewayAutoBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/autoBarrel.hbs`, 'utf8')
      },
      gatewayInterfacesBarrel: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/interfacesBarrel.hbs`, 'utf8')
      },
      // gatewaySwiftClient: {
      //   template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/swiftClient.hbs`, 'utf8')
      // },
      gatewayTsClient: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/tsClient.hbs`, 'utf8')
      },
      gatewayClientIndex: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/clientIndex.hbs`, 'utf8')
      },
      gatewayClientPackage: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/clientPackage.hbs`, 'utf8')
      },
      gatewayClientTsConfig: {
        template: fs.readFileSync(`${__dirname}/../../bin/templates/gateway/clientTsConfig.hbs`, 'utf8')
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

const isGateway = fs.existsSync('./src/routes');
const isService = fs.existsSync('./src/calls');

if (isGateway) {
  const interfaces: any = {};
  const gatewayRoutes = fs.readdirSync(`./src/routes`)
    .filter(gatewayRoute => !/\.ts$/i.test(gatewayRoute));
  gatewayRoutes.forEach((gatewayRoute) => {
    const routeObject = require(path.normalize(`${process.cwd()}/src/routes/${gatewayRoute}`));
    let uri = '';
    Object.keys(routeObject).forEach((key) => {
      if (routeObject[key] instanceof Function) {
        const route = new routeObject[key]();
        if (route.uri) {
          uri = route.uri;
        }
      }
    });
    const methods = fs.readdirSync(`./src/routes/${gatewayRoute}`)
      .filter(method => !/\.ts$/i.test(method));
    methods.forEach((method) => {
      const schemaItem = fs.readdirSync(`./src/routes/${gatewayRoute}/${method}`)
        .filter(item => /\.schema\.ts$/i.test(item))[0];

      const interfaceObject = require(path.normalize(`${process.cwd()}/src/routes/${gatewayRoute}/${method}/${schemaItem}`));
      Object.keys(interfaceObject).forEach((key) => {
        const name = Case.camel(key).replace(/Schema$/, '');
        if (!interfaces[gatewayRoute]) {
          interfaces[gatewayRoute] = {
            methods: {},
            uri
          };
        }
        interfaces[gatewayRoute].methods[method] = {
          ...interfaceObject[key],
          name
        };
      });
    });
  });

  const pkg = require(path.normalize(`${process.cwd()}/package.json`));
  const gatewayName = Case.pascal(pkg.name.split('gateway-')[1]);

  generateHandler({
    packageName: pkg.name,
    name: gatewayName,
    type: 'gateway',
    path: `./src`,
    specs: {
      interfaces
    }
  });
}

if (isService) {
  const interfaces: any = {};
  const items = fs.readdirSync(`./src/calls`)
    .filter(item => !/\.ts$/i.test(item));
  items.forEach((item) => {
    const schemaItem = fs.readdirSync(`./src/calls/${item}`)
      .filter(item => /\.schema\.ts$/i.test(item))[0];

    const interfaceObject = require(path.normalize(`${process.cwd()}/src/calls/${item}/${schemaItem}`));
    Object.keys(interfaceObject).forEach((key) => {
      const name = Case.camel(key).replace(/Schema$/, '');
      interfaces[name] = interfaceObject[key];
    });
  });

  const pkg = require(path.normalize(`${process.cwd()}/package.json`));
  const serviceName = Case.pascal(pkg.name.split('service-')[1]);

  generateHandler({
    packageName: pkg.name,
    name: serviceName,
    type: 'service',
    path: `./src`,
    specs: {
      interfaces
    }
  });
}

if (!isGateway && !isService) {
  const pkg = require(path.normalize(`${process.cwd()}/package.json`));
  
  const gateways = fs.readdirSync('./src/gateways')
    .filter(gateway => fs.lstatSync(`./src/gateways/${gateway}`).isDirectory());
  gateways.forEach((gateway) => {
    const interfaces: any = {};
    const gatewayRoutes = fs.readdirSync(`./src/gateways/${gateway}/routes`)
      .filter(gatewayRoute => !/\.ts$/i.test(gatewayRoute));
    gatewayRoutes.forEach((gatewayRoute) => {
      const routeObject = require(path.normalize(`${process.cwd()}/src/gateways/${gateway}/routes/${gatewayRoute}`));
      let uri = '';
      Object.keys(routeObject).forEach((key) => {
        if (routeObject[key] instanceof Function) {
          const route = new routeObject[key]();
          if (route.uri) {
            uri = route.uri;
          }
        }
      });
      const methods = fs.readdirSync(`./src/gateways/${gateway}/routes/${gatewayRoute}`)
        .filter(method => !/\.ts$/i.test(method));
      methods.forEach((method) => {
        const schemaItem = fs.readdirSync(`./src/gateways/${gateway}/routes/${gatewayRoute}/${method}`)
          .filter(item => /\.schema\.ts$/i.test(item))[0];

        const interfaceObject = require(path.normalize(`${process.cwd()}/src/gateways/${gateway}/routes/${gatewayRoute}/${method}/${schemaItem}`));
        Object.keys(interfaceObject).forEach((key) => {
          const name = Case.camel(key).replace(/Schema$/, '');
          if (!interfaces[gatewayRoute]) {
            interfaces[gatewayRoute] = {
              methods: {},
              uri
            };
          }
          interfaces[gatewayRoute].methods[method] = {
            ...interfaceObject[key],
            name
          };
        });
      });
    });

    generateHandler({
      packageName: pkg.name,
      name: gateway,
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
      const schemaItem = fs.readdirSync(`./src/services/${service}/calls/${item}`)
        .filter(item => /\.schema\.ts$/i.test(item))[0];

      const interfaceObject = require(path.normalize(`${process.cwd()}/src/services/${service}/calls/${item}/${schemaItem}`));
      Object.keys(interfaceObject).forEach((key) => {
        const name = Case.camel(key).replace(/Schema$/, '');
        interfaces[name] = interfaceObject[key];
      });
    });

    generateHandler({
      packageName: pkg.name,
      name: service,
      type: 'service',
      path: `./src/services/${service}`,
      specs: {
        interfaces
      }
    });
  });
}
