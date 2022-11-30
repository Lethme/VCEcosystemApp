import RequestOptions from "./utils/types/RequestOptions";
import {
  getRequestPath,
  getRequestPrefix,
  getRequestQuery,
  getRequestUrl,
} from "./utils";
import RequestHost from "./utils/types/RequestHost";
import RequestProtocol from "./utils/types/RequestProtocol";
import RequestPort from "./utils/types/RequestPort";

class Url<T = never> {
  readonly host: RequestHost;
  readonly protocol?: RequestProtocol;
  readonly port?: RequestPort;
  readonly path?: Array<string>;
  readonly prefix?: Array<string>;
  readonly query?: T;

  constructor(host: RequestHost, options?: RequestOptions<T>) {
    this.host = host;
    this.protocol = options?.protocol;
    this.port = options?.port;
    this.path = getRequestPath(options?.path);
    this.prefix = getRequestPrefix(options?.prefix);
    this.query = getRequestQuery(options?.query);
  }

  get Host(): RequestHost {
    return this.host;
  }
  get Protocol(): RequestProtocol | undefined {
    return this.protocol;
  }
  get Port(): RequestPort | undefined {
    return this.port;
  }
  get Path(): Array<string> | undefined {
    return this.path;
  }
  get Prefix(): Array<string> | undefined {
    return this.prefix;
  }
  get Query(): T | undefined {
    return this.query;
  }
  get Url(): string {
    return this.toString();
  }
  get Options(): RequestOptions<T> {
    return {
      protocol: this.protocol,
      port: this.port,
      path: this.path,
      prefix: this.prefix,
      query: this.query,
    };
  }

  toString(): string {
    return getRequestUrl<T>(this.host, this.Options);
  }

  static Create<T>(host: RequestHost, options?: RequestOptions<T>) {
    return new Url<T>(host, options);
  }
}

export default Url;
