import { Path } from '../../../../../../app';

import { CreateUserOperation } from '../operations';

export class UsersPath extends Path {
  uri = '/users';
  methods = {
    post: CreateUserOperation
  };
}
