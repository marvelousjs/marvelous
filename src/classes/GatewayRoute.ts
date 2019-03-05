import { GatewayMethod } from './GatewayMethod';

export interface IGatewayRoute {
  uri: string;
  methods: {
    delete?: { new(): GatewayMethod };
    get?: { new(): GatewayMethod };
    options?: { new(): GatewayMethod };
    patch?: { new(): GatewayMethod };
    post?: { new(): GatewayMethod };
    put?: { new(): GatewayMethod };
  };
}

export interface IGatewayRouteArgs {
  uri?: string;
}

export class GatewayRoute implements IGatewayRoute {
  uri: string = '/';
  methods: {
    delete?: { new(): GatewayMethod };
    get?: { new(): GatewayMethod };
    options?: { new(): GatewayMethod };
    patch?: { new(): GatewayMethod };
    post?: { new(): GatewayMethod };
    put?: { new(): GatewayMethod };
  } = {};

  constructor(args?: IGatewayRouteArgs) {
    if (args && args.uri !== undefined) {
      this.uri = args.uri;
    }
  }
}
