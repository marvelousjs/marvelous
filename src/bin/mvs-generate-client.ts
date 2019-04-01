import * as Case from 'case';
import * as fs from 'fs-extra';
import * as path from 'path';
import zapp from '@zappjs/core';

interface IGenerateOpts {
  packageName: string;
  packageVersion: string;
  name: string,
  path: string;
  specs: any;
  type: string;
}

function generateHandler(opts: IGenerateOpts) {
  const files = opts.type === 'gateway' ? {
    tsClient: {
      filename: `${opts.path}/.auto/clients/src/${Case.pascal(opts.name)}GatewayClient.ts`,
      engine: 'handlebars',
      template: 'gatewayTsClient',
      mapping: {
        gatewayName: opts.name,
        gatewaySchema: '/gatewaySchema',
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
        packageName: opts.packageName,
        packageVersion: opts.packageVersion
      }
    },
    clientTsConfig: {
      filename: `${opts.path}/.auto/clients/tsconfig.json`,
      engine: 'handlebars',
      template: 'gatewayClientTsConfig'
    }
  } : {
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
    }
  };

  const items = zapp({
    encoders: {},
    files,
    meta: {},
    schemas: {},
    specs: opts.specs,
    templates: {
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

export function generateClient() {
  const isGateway = fs.existsSync('./src/routes');
  const isService = fs.existsSync('./src/calls');

  if (isGateway) {
    const gatewaySchema: any = fs.readdirSync(`./src`)
      .filter(schema => /\.schema\.ts$/i.test(schema))
      .reduce((_0, currentValue) => {
        let newValue = {};
        const interfaceObject = require(path.normalize(`${process.cwd()}/src/${currentValue}`));
        Object.keys(interfaceObject).forEach((interfaceObjectKey) => {
          newValue = interfaceObject[interfaceObjectKey];
        });
        return newValue;
      }, {});
    if (!gatewaySchema.user) {
      gatewaySchema.user = {};
    }

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
      packageVersion: pkg.version,
      name: gatewayName,
      type: 'gateway',
      path: `./src`,
      specs: {
        gatewaySchema,
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
      packageVersion: pkg.version,
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
        packageVersion: pkg.version,
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
        packageVersion: pkg.version,
        name: service,
        type: 'service',
        path: `./src/services/${service}`,
        specs: {
          interfaces
        }
      });
    });
  }
}