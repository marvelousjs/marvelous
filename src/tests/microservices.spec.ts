import * as assert from 'assert';
import { Request } from 'express';

import axios from 'axios';
import { Gateway, GatewayMethod, GatewayRoute, Service, ServiceCall } from '../classes';

describe('server', () => {
  interface ITask {
    id: number;
    text: string;
  }

  let nextTaskId = 1;
  const tasks: ITask[] = [];

  class TaskService extends Service {
    calls = {
      createTask: CreateTaskCall,
      listTasks: ListTasksCall
    };
  }

  interface ITaskServiceClientConstructor {
    url: string;
  }

  interface ITaskServiceClientCreateTaskFunction {
    (request?: ITaskServiceClientCreateTaskRequest): Promise<ITaskServiceClientCreateTaskResponse>;
  }

  interface ITaskServiceClientCreateTaskRequest {
    text: string;
  }

  interface ITaskServiceClientCreateTaskResponse {
    id: string;
  }

  interface ITaskServiceClientListTasksFunction {
    (request?: ITaskServiceClientListTasksRequest): Promise<ITaskServiceClientListTasksResponse>;
  }

  interface ITaskServiceClientListTasksRequest {}

  interface ITaskServiceClientListTasksResponse {
    tasks: ITaskServiceClientListTasksResponseTask[];
  }

  interface ITaskServiceClientListTasksResponseTask {
    id: number;
    text: string;
  }

  class TaskServiceClient {
    url = '';
    constructor(opts: ITaskServiceClientConstructor) {
      this.url = opts.url;
    }
    createTask: ITaskServiceClientCreateTaskFunction = async req => {
      const res = await axios({
        method: 'POST',
        url: 'http://localhost:4000/createTask',
        data: {
          text: req.text
        }
      });
      return {
        id: res.data.id
      };
    };
    listTasks: ITaskServiceClientListTasksFunction = async () => {
      const res = await axios({
        method: 'POST',
        url: 'http://localhost:4000/listTasks'
      });
      return {
        tasks: res.data.tasks
      };
    };
  }

  interface ICreateTaskHandler {
    (request?: ICreateTaskRequest): Promise<ICreateTaskResponse>;
  }

  interface ICreateTaskRequest {
    text: string;
  }

  interface ICreateTaskResponse {
    id: number;
  }

  class CreateTaskCall extends ServiceCall {
    handler: ICreateTaskHandler = async request => {
      const task = {
        ...request,
        id: nextTaskId
      };
      tasks.push(task);
      nextTaskId++;
      return {
        id: task.id
      };
    };
  }

  interface IListTasksHandler {
    (request?: IListTasksRequest): Promise<IListTasksResponse>;
  }

  interface IListTasksRequest {}

  interface IListTasksResponse {
    tasks: IListTasksResponseTask[];
  }

  interface IListTasksResponseTask {
    id: number;
    text: string;
  }

  class ListTasksCall extends ServiceCall {
    handler: IListTasksHandler = async () => {
      return {
        tasks: tasks.map((task: IListTasksResponseTask) => ({
          id: task.id,
          text: task.text
        }))
      };
    };
  }

  class PublicGateway extends Gateway {
    routes = [TasksRoute];
  }

  class TasksRoute extends GatewayRoute {
    uri = '/tasks';
    methods = {
      get: GetTasksMethod,
      post: PostTasksMethod
    };
  }

  class GetTasksMethod extends GatewayMethod {
    handler: any = async () => {
      const result = await taskServiceClient.listTasks();
      return {
        status: 200,
        body: result.tasks
      };
    };
  }

  class PostTasksMethod extends GatewayMethod {
    handler: any = async (req: Request) => {
      const result = await taskServiceClient.createTask({
        text: req.body.text
      });
      return {
        status: 201,
        body: {
          id: result.id
        }
      };
    };
  }

  // create task service + client
  const taskServiceUrl = 'http://localhost:4000';
  const taskService = new TaskService({
    url: taskServiceUrl
  });
  const taskServiceClient = new TaskServiceClient({
    url: taskServiceUrl
  });

  // create public gateway
  const publicGateway = new PublicGateway({
    enableLogging: true,
    url: 'http://localhost:3000'
  });

  before(async () => {
    // start task service
    await taskService.start();

    // start public service
    await publicGateway.start();
  });

  after(async () => {
    // stop task service
    await taskService.stop();

    // stop public service
    await publicGateway.stop();
  });

  it('should create task', async () => {
    const result = await axios({
      method: 'POST',
      url: 'http://localhost:3000/tasks',
      data: {
        text: 'eat'
      }
    });

    assert.strictEqual(result.data.id, 1);
  });

  it('should get tasks', async () => {
    const result = await axios({
      method: 'GET',
      url: 'http://localhost:3000/tasks'
    });

    assert.deepStrictEqual(result.data, [
      {
        id: 1,
        text: 'eat'
      }
    ]);
  });
});
