// from marvelous
import { RpcServer } from '../../../../../app';

import { CreateUserMethod } from './methods';

export class UserRpcServer extends RpcServer {
  methods = [
    CreateUserMethod
  ];
}
