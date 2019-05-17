# marvelous [![npm](https://img.shields.io/npm/v/marvelous.svg)](https://npmjs.com/marvelous) [![Build Status](https://travis-ci.org/marvelousjs/marvelous.svg?branch=master)](https://travis-ci.org/marvelousjs/marvelous)

> the marvelous framework - microservices for node.js

![microservices](https://files.readme.io/b4c990c-microservices.png)

## Sample Application

### Task Service

This RPC service reads/writes tasks for a to-do list:

> Tip: this service is accessible via http://localhost:4000

```ts
class TaskService extends Service {
  calls = {
    createTask: CreateTaskCall,
    listTasks: ListTasksCall
  };
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

const taskService = new TaskService({
  url: 'http://localhost:4000'
});
taskService.start();
```

### Public Gateway

This REST gateway exposes the Task Service functionality:

> Tip: this service is accessible via http://localhost:3000

```ts
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

const publicGateway = new PublicGateway({
  url: 'http://localhost:3000'
});
publicGateway.start();
```

## API Reference

### Gateway

#### Properties

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <div><b>environment</b> string</div>
                <em>the gateway environment</em>
            </td>
            <td>
                <code>"production"</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>enableLogging</b> string</div>
                <em>enables gateway logging</em>
            </td>
            <td>
                <code>true</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>knownErrors</b> GatewayError[]</div>
                <em>an array of gateway errors</em>
            </td>
            <td>
                <code>[ AuthServiceError ]</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>onLoad</b> Function</div>
                <em>fires when gateway is loaded</em>
            </td>
            <td></td>
        </tr>
        <tr>
            <td>
                <div><b>onStart</b> Function</div>
                <em>fires when gateway is started</em>
            </td>
            <td></td>
        </tr>
        <tr>
            <td>
                <div><b>onStop</b> Function</div>
                <em>fires when gateway is stopped</em>
            </td>
            <td></td>
        </tr>
        <tr>
            <td>
                <div><b>routes</b> GatewayRoute[]</div>
                <em>an array of gateway routes</em>
            </td>
            <td>
                <code>[ UsersRoute ]</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>url</b> string</div>
                <em>the gateway url</em>
            </td>
            <td>
                <code>"http://localhost:3000"</code>
            </td>
        </tr>
    </tbody>
</table>

### GatewayError

#### Properties

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <div><b>code</b> number</div>
                <em>the error status code</em>
            </td>
            <td>
                <code>401</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>name</b> string</div>
                <em>the error name</em>
            </td>
            <td>
                <code>"AuthGatewayError"</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>message</b> Function</div>
                <em>the error message</em>
            </td>
            <td>
                <code>"You must be logged in."</code>
            </td>
        </tr>
    </tbody>
</table>

### GatewayMethod

#### Properties

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <div><b>handler</b> Function</div>
                <em>the gateway method handler</em>
            </td>
            <td></td>
        </tr>
        <tr>
            <td>
                <div><b>schema</b> object</div>
                <em>the gateway method schema</em>
            </td>
            <td></td>
        </tr>
    </tbody>
</table>

### GatewayRoute

#### Properties

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <div><b>uri</b> string</div>
                <em>the gateway route uri</em>
            </td>
            <td>
                <code>"/users"</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>delete</b> GatewayMethod</div>
                <em>DELETE method</em>
            </td>
            <td>
                <code>DeleteUserMethod</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>get</b> GatewayMethod</div>
                <em>GET method</em>
            </td>
            <td>
                <code>GetUsersMethod</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>options</b> GatewayMethod</div>
                <em>OPTIONS method</em>
            </td>
            <td>
                <code>OptionsUsersMethod</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>patch</b> GatewayMethod</div>
                <em>PATCH method</em>
            </td>
            <td>
                <code>PatchUserMethod</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>post</b> GatewayMethod</div>
                <em>POST method</em>
            </td>
            <td>
                <code>PostUsersMethod</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>put</b> GatewayMethod</div>
                <em>PUT method</em>
            </td>
            <td>
                <code>PutUserMethod</code>
            </td>
        </tr>
    </tbody>
</table>

### Service

#### Properties

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <div><b>calls</b> object</div>
                <em>the service calls</em>
            </td>
            <td>
                <code>{ createUser: CreateUserCall }</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>environment</b> string</div>
                <em>the service environment</em>
            </td>
            <td>
                <code>"production"</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>enableLogging</b> string</div>
                <em>enables service logging</em>
            </td>
            <td>
                <code>true</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>onLoad</b> Function</div>
                <em>fires when service is loaded</em>
            </td>
            <td></td>
        </tr>
        <tr>
            <td>
                <div><b>onStart</b> Function</div>
                <em>fires when service is started</em>
            </td>
            <td></td>
        </tr>
        <tr>
            <td>
                <div><b>onStop</b> Function</div>
                <em>fires when service is stopped</em>
            </td>
            <td></td>
        </tr>
        <tr>
            <td>
                <div><b>url</b> string</div>
                <em>the service url</em>
            </td>
            <td>
                <code>"http://localhost:3000"</code>
            </td>
        </tr>
    </tbody>
</table>

### ServiceCall

#### Properties

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <div><b>handler</b> Function</div>
                <em>the service call handler</em>
            </td>
            <td></td>
        </tr>
        <tr>
            <td>
                <div><b>schema</b> object</div>
                <em>the service call schema</em>
            </td>
            <td></td>
        </tr>
    </tbody>
</table>

### ServiceError

#### Properties

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <div><b>name</b> string</div>
                <em>the error name</em>
            </td>
            <td>
                <code>"AuthGatewayError"</code>
            </td>
        </tr>
        <tr>
            <td>
                <div><b>message</b> Function</div>
                <em>the error message</em>
            </td>
            <td>
                <code>"You must be logged in."</code>
            </td>
        </tr>
    </tbody>
</table>
