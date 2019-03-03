import { RestPath } from '../../../../../../app';

import { CreateUserOperation } from '../operations';

export class UsersPath extends RestPath {
  uri = '/users';
  methods = {
    post: CreateUserOperation
  };
}
