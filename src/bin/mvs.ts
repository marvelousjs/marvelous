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
        template: `import {\n{{#each interfaces}}  I{{{case @key 'pascal'}}}Function{{#unless @last}},\n{{/unless}}{{/each}}\n} from './functions';\n\nexport interface IApi {\n{{#each interfaces}}  {{{case @key 'camel'}}}: I{{{case @key 'pascal'}}}Function;\n{{/each}}\n}`
      },
      functionInterface: {
        template: `export interface I{{{case name 'pascal'}}}Function {\n  (req?: I{{{case name 'pascal'}}}Request): Promise<I{{{case name 'pascal'}}}Response>;\n}\n\n{{#each interfaces}}{{{tsInterface (concat ../name (case @key 'pascal')) this}}}{{#unless @last}}\n{{/unless}}{{/each}}`
      },
      functionsBarrel: {
        template: `{{#each interfaces}}export * from './{{{@key}}}';\n{{/each}}`
      },
      interfacesBarrel: {
        template: `export * from './app';\nexport * from './functions';`
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
  const name = path.basename(item).replace(/\.schema\.ts$/i, '');
  const interfaceObject = require(path.normalize(`${process.cwd()}/src/schemas/${item}`)).default;
  interfaces[name] = interfaceObject;
});

generateHandler({
  specs: {
    interfaces
  }
});