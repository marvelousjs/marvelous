import { GatewayMethod, IGatewayMethod } from './GatewayMethod';

export interface IGatewayRoute {
  uri: string;
  methods: {
    delete?: { new(): GatewayMethod } | IGatewayMethod;
    get?: { new(): GatewayMethod } | IGatewayMethod;
    options?: { new(): GatewayMethod } | IGatewayMethod;
    patch?: { new(): GatewayMethod } | IGatewayMethod;
    post?: { new(): GatewayMethod } | IGatewayMethod;
    put?: { new(): GatewayMethod } | IGatewayMethod;
  };
}

export interface IGatewayRouteArgs {
  uri?: string;
}

export class GatewayRoute implements IGatewayRoute {
  uri: string = '/';
  methods: {
    delete?: { new(): GatewayMethod } | IGatewayMethod;
    get?: { new(): GatewayMethod } | IGatewayMethod;
    options?: { new(): GatewayMethod } | IGatewayMethod;
    patch?: { new(): GatewayMethod } | IGatewayMethod;
    post?: { new(): GatewayMethod } | IGatewayMethod;
    put?: { new(): GatewayMethod } | IGatewayMethod;
  } = {};

  constructor(args?: IGatewayRouteArgs) {
    if (args && args.uri !== undefined) {
      this.uri = args.uri;
    }
  }
}
