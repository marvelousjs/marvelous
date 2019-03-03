import * as assert from 'assert';
import { IModel, Model, AttributeTypes as Types } from 'jazzdb';

import { PublicRestClient } from './test-project/apis/public/clients/client';
import { PrivateRestClient } from './test-project/apis/private/clients/client';

import { PublicRestServer } from './test-project/apis/public/app';
import { PrivateRestServer } from './test-project/apis/private/app';

import { UserRpcServer } from './test-project/services/user/app';
import { RepoRpcServer } from './test-project/services/repo/app';

describe('server', () => {
  // create api clients
  const publicRestClient = new PublicRestClient();
  const privateRestClient = new PrivateRestClient();

  // create api servers
  const publicRestServer = new PublicRestServer();
  const privateRestServer = new PrivateRestServer();

  // create rpc servers
  const userRpcServer = new UserRpcServer();
  const repoRpcServer = new RepoRpcServer();

  before(async () => {
    // start api servers
    await publicRestServer.start();
    await privateRestServer.start();

    // start rpc servers
    await userRpcServer.start();
    await repoRpcServer.start();
  });

  it('should create user', async () => {
    const result = await publicRestClient.createUser({
      auth: {
        role: 'guest'
      },
      body: {
        email: 'test@test.com',
        password: 'password'
      }
    });

    assert.deepStrictEqual(
      result.user,
      {
        id: 'abc123'
      }
    );
  });
});
