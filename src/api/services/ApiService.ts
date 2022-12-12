import {
  ApiRequestOptions,
  RequestHost,
  RequestOptions,
  RequestPort,
  RequestPrefix,
  RequestProtocol,
} from "@/api/services/utils/types";

import { Url } from "@/api/services";
import axios, {AxiosError} from "axios";
import {ApiResponse} from "@/api/services/types";
import {Message} from "@/api/services/types/Message";

class ApiService {
  public static get ApiToken(): string | null {
    return localStorage.getItem("api_token");
  }

  protected static set ApiToken(token: string | null) {
    token
        ? localStorage.setItem("api_token", token)
        : localStorage.removeItem("api_token");
  }

  protected static get ApiRequestHeaders() {
    return {
      "Authorization": `Bearer ${this.ApiToken || ""}`
    }
  }

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
    callback: () => (ApiResponse<T | Message>) | Promise<ApiResponse<T | Message>>
  ): Promise<ApiResponse<T | Message>> {
    try {
      return await callback();
    } catch (ex) {
      console.log(ex);
      return (ex as any).response.data;
    }
  }
}

export default ApiService;
