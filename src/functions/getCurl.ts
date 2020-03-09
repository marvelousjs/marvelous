import { Request } from 'express';
import { AddressInfo } from 'net';

import { getQuery } from './getQuery';

export const getCurl = (req: Request, addressInfo: AddressInfo) => {
  const curlArgs = [
    'curl',
    `-X${req.method}`,
    `${req.protocol}://${req.hostname}:${addressInfo.port}${req.path}${getQuery(req.query)}`
  ];
  if (req.headers) {
    Object.entries(req.headers).forEach(([key, value]) => {
      curlArgs.push(`--header '${key}: ${value}'`);
    });
  }
  if (Object.keys(req.body).length) {
    curlArgs.push(`--data-raw '${JSON.stringify(req.body)}'`);
  }
  return curlArgs.join(' ');
};
