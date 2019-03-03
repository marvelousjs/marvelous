// from marvelous
import { RestServer } from '../../../../../app';

import { AuthError } from './errors';
import { UserProfilePath, UserReposPath, UsersPath } from './paths';

export class PrivateRestServer extends RestServer {
  errors = [
    AuthError
  ];
  paths = [
    UserProfilePath,
    UserReposPath,
    UsersPath
  ];
}
