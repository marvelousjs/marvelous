import * as assert from 'assert';
import { IModel, Model, AttributeTypes as Types } from 'jazzdb';

import { handler } from '../utils';

describe('server', () => {
  // echo function

  const EchoSchema = {
    request: {
      type: 'object',
      additionalProperties: false,
      properties: {
        text: {
          required: true,
          type: 'string'
        }
      }
    },
    response: {
      type: 'object',
      additionalProperties: false,
      properties: {
        text: {
          required: true,
          type: 'string'
        }
      }
    }
  };

  interface IEchoFunction {
    (
      args: {
        context: ITestServerContext,
        request?: IEchoRequest
      }
    ): Promise<IEchoResponse>;
  }

  interface IEchoHandler {
    (request?: IEchoRequest): Promise<IEchoResponse>;
  }

  interface IEchoRequest {
    text: string;
  }

  interface IEchoResponse {
    text: string;
  }

  const echo: IEchoFunction = async ({ request }) => {
    return {
      text: request.text
    };
  }

  // list users function

  const ListUsersSchema = {
    request: {
      type: 'object',
      additionalProperties: false,
      properties: {}
    },
    response: {
      type: 'object',
      additionalProperties: false,
      properties: {
        users: {
          required: true,
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              username: {
                required: true,
                type: 'string'
              }
            }
          }
        }
      }
    }
  };

  interface IListUsersFunction {
    (
      args: {
        context: ITestServerContext,
        request?: IListUsersRequest
      }
    ): Promise<IListUsersResponse>;
  }

  interface IListUsersHandler {
    (request?: IListUsersRequest): Promise<IListUsersResponse>;
  }

  interface IListUsersRequest {}

  interface IListUsersResponse {
    users: IListUsersResponseUser[];
  }

  interface IListUsersResponseUser {
    username: string;
  }

  const listUsers: IListUsersFunction = async ({ context }) => {
    return {
      users: context.data.users.toArray().map((u) => ({
        username: u.username
      }))
    };
  }

  // test models

  interface IUserModel extends IModel {
    email: string;
    username: string;
    password: string;
  }

  class UserModel extends Model {
    name = 'users';
    attributes = {
      email: {
        required: true,
        unique: true,
        type: Types.String
      },
      username: {
        required: true,
        unique: true,
        type: Types.String
      },
      password: {
        required: true,
        type: Types.String
      }
    };

    async load(): Promise<UserModel> {
      return super.load();
    }
    async save(): Promise<UserModel> {
      return super.save();
    }
    create(data: IUserModel): IUserModel {
      return super.create(data);
    }
    delete(id: string): IUserModel {
      return super.delete(id);
    }
    get(id: string): IUserModel {
      return super.get(id);
    }
    toArray(): IUserModel[] {
      return super.toArray();
    }
    update(id: string, data: IUserModel): IUserModel {
      return super.update(id, data);
    }
  }

  // test server context

  interface ITestServerContext {
    data: {
      users?: UserModel;
    };
  }

  it('should call function', async () => {
    const context = {};

    const echoHandler: IEchoHandler = handler(
      echo,
      EchoSchema,
      context
    );

    const response = await echoHandler({
      text: 'test'
    });
    assert.deepStrictEqual(response, { text: 'test' });
  });

  it('should call function with context', async () => {
    const context = {
      data: {
        users: new UserModel()
      }
    };

    const listUsersHandler: IListUsersHandler = handler(
      listUsers,
      ListUsersSchema,
      context
    );

    const response = await listUsersHandler();
    assert.deepStrictEqual(response, { users: [] });
  });
});
