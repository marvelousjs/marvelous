// from marvelous
import { Operation } from '../../../../../../app';

// from user service
import { UserServiceClient } from '../../../services/user/clients/client';

import { GuestRole } from '../roles';

export class CreateUserOperation extends Operation {
  roles = [
    GuestRole
  ];
  handler: ICreateUserOperation = async () => {
    const userServiceClient = new UserServiceClient();
    await userServiceClient.createUser();
    return {};
  };
}
