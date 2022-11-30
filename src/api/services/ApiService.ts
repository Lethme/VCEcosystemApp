import {
  ApiRequestOptions,
  RequestHost,
  RequestOptions,
  RequestPort,
  RequestPrefix,
  RequestProtocol,
} from "@/api/services/utils/types";

import { Url } from "@/api/services";

class ApiService {
  static get ApiHost(): RequestHost {
    return process.env.VUE_APP_API_HOST || "localhost";
  }
  static get ApiProtocol(): RequestProtocol {
    return (process.env.VUE_APP_API_PROTOCOL as RequestProtocol) || "";
  }
  static get ApiPort(): RequestPort | undefined {
    return +process.env.VUE_APP_API_PORT! || undefined;
  }
  static get ApiPrefix(): RequestPrefix {
    return process.env.VUE_APP_API_PREFIX || "";
  }
  static CreateRequestUrl<T = never>(
    host: RequestHost,
    options?: RequestOptions<T>
  ): Url<T> {
    return Url.Create<T>(host, options);
  }

  static CreateApiRequestUrl<T = never>(options?: ApiRequestOptions<T>) {
    return Url.Create<T>(this.ApiHost, {
      protocol: this.ApiProtocol,
      port: this.ApiPort,
      prefix: this.ApiPrefix,
      path: options?.path,
      query: options?.query,
    });
  }

  static async Try<T>(
    callback: () => (T | undefined) | Promise<T | undefined>
  ): Promise<T | undefined> {
    try {
      return await callback();
    } catch (ex) {
      console.log(ex);
      return undefined;
    }
  }
}

export default ApiService;
