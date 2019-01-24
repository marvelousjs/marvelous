import { configs as development } from './development';
import { configs as production } from './production';
import { configs as test } from './test';

import { IConfig } from '../interfaces';

function getConfig(): IConfig {
    switch (process.env.NODE_ENV) {
        case 'development': {
            return development;
        }
        case 'production': {
            return production;
        }
        case 'test': {
            return test;
        }
        default: {
            return {};
        }
    }
}

export const configs = getConfig();
