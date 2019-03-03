import { Path } from '../../../../../../app';

import { CreateUserOperation } from '../operations';

export class UserReposPath extends Path {
  uri = '/users/:userId/repos';
  methods = {
    post: GetUserReposOperation
  };
}
