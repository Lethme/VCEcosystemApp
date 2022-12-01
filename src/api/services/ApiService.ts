import {
  ApiRequestOptions,
  RequestHost,
  RequestOptions,
  RequestPort,
  RequestPrefix,
  RequestProtocol,
} from "@/api/services/utils/types";

import { Url } from "@/api/services";
import {AxiosError} from "axios";
import {ApiResponse} from "@/api/services/types";

class ApiService {
  protected static get ApiHost(): RequestHost {
    return process.env.VUE_APP_API_HOST || "localhost";
  }
  protected static get ApiProtocol(): RequestProtocol {
    return (process.env.VUE_APP_API_PROTOCOL as RequestProtocol) || "";
  }
  protected static get ApiPort(): RequestPort | undefined {
    return +process.env.VUE_APP_API_PORT! || undefined;
  }
  protected static get ApiPrefix(): RequestPrefix {
    return process.env.VUE_APP_API_PREFIX || "";
  }
  protected static CreateRequestUrl<T = never>(
    host: RequestHost,
    options?: RequestOptions<T>
  ): Url<T> {
    return Url.Create<T>(host, options);
  }

  protected static CreateApiRequestUrl<T = never>(options?: ApiRequestOptions<T>) {
    return Url.Create<T>(this.ApiHost, {
      protocol: this.ApiProtocol,
      port: this.ApiPort,
      prefix: this.ApiPrefix,
      path: options?.path,
      query: options?.query,
    });
  }

  protected static async Try<T>(
    callback: () => (ApiResponse<T | string>) | Promise<ApiResponse<T | string>>
  ): Promise<ApiResponse<T | string>> {
    try {
      return await callback();
    } catch (ex) {
      console.log(ex);
      return (ex as any).response.data;
    }
  }
}

export default ApiService;
