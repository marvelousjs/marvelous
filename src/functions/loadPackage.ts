import * as fs from 'fs';

interface IPackage {
  name: string;
  dependencies?: {
    [name: string]: string;
  };
  devDependencies?: {
    [name: string]: string;
  };
}

export const loadPackage = (): IPackage => {
  try {
    return {
      name: '',
      ...JSON.parse(fs.readFileSync('./package.json', 'utf8'))
    };
  } catch {}
  return {
    name: ''
  };
};
