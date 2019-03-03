import { Path } from '../../../../../../app';

import { GetUserProfileOperation } from '../operations';

export class UserProfilePath extends Path {
  uri = '/users';
  methods = {
    get: GetUserProfileOperation
  };
}
