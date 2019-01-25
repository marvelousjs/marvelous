import * as assert from 'assert';
import { IModel, Model, AttributeTypes as Types, loadData } from 'jazzdb';

import { Server } from '../server';

describe('server', () => {
  // echo function

  interface IEcho {
    (req?: IEchoRequest): Promise<IEchoResponse>;
  }

  interface IEchoRequest {
    text: string;
  }

  interface IEchoResponse {
    text: string;
  }

  const echo: IEcho = async function (req) {
    return {
      text: req.text
    };
  }

  // list users function

  interface IListUsers {
    (req?: IListUsersRequest): Promise<IListUsersResponse>;
  }

  interface IListUsersRequest {}

  interface IListUsersResponse{
    users: IListUsersResponseUser[];
  }

  interface IListUsersResponseUser {
    username: string;
  }

  const listUsers: IListUsers = async function (req) {
    const context: ITestServerContext = this.context;

    return {
      users: context.data.users.toArray().map((u) => ({
        username: u.username
      }))
    }
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

  // test server

  interface ITestServer extends Server {
    context: ITestServerContext;
    functions: {
      echo: IEcho;
      listUsers: IListUsers;
    };
  }

  interface ITestServerContext {
    data: {
      users?: UserModel;
    };
  }

  const testServer: ITestServer = new Server({
    functions: {
      echo,
      listUsers
    }
  });

  beforeEach(async () => {
    await testServer.start();
  });

  afterEach(async () => {
    await testServer.stop();
  });

  it('should call function', async () => {
    const response = await testServer.functions.echo({
      text: 'test'
    });
    assert.deepStrictEqual(response, { text: 'test' });
  });

  it('should call function with context', async () => {
    testServer.setContext({
      data: await loadData({
        path: `./data/${testServer.environment}`,
        models: {
          users: UserModel
        }
      })
    });

    const response = await testServer.functions.listUsers();
    assert.deepStrictEqual(response, { users: [] });
  });
});
