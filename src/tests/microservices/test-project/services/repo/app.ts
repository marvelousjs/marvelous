// from marvelous
import { RpcServer } from '../../../../../app';

import { CreateRepoMethod } from './methods';

export class RepoRpcServer extends RpcServer {
  methods = [
    CreateRepoMethod
  ];
}
