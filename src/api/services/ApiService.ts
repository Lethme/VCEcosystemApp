import {Url} from "@/api/services";
import {ApiResponse, PasswordState, PasswordStateFieldType} from "@/api/services/types";
import {Message} from "@/api/services/types/Message";
import {
  ApiRequestOptions,
  RequestHost,
  RequestOptions,
  RequestPort,
  RequestPrefix,
  RequestProtocol,
} from "@/api/services/utils/types";
import {alphabetLowercase, alphabetUppercase, numbers, specialSymbols} from "@/api/utils/constans";
import store from "@/store";
import RequestPath from "./utils/types/RequestPath";

class ApiService {
  public static get PasswordRegex(): RegExp {
    return new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#$^+=!*@%&]).{8,24}$`);
  }

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

  public static GetProfilePicturePath(uuid: string) {
    return this.CreateRequestUrl(this.ApiHost, {
      protocol: this.ApiProtocol,
      port: this.ApiPort,
      path: ['public', 'img', 'users', 'profile_pics', `${uuid}.jpg`],
    }).Url;
  }

  public static Match(str: string, regexp: RegExp): boolean {
    const match = str.match(regexp);
    return !!(match && match.length);
  }

  public static PasswordMatch(password: string): boolean {
    return this.Match(password, this.PasswordRegex);
  }

  public static PasswordState(password: string): PasswordState {
    return [
      {
        type: PasswordStateFieldType.Length,
        text: "Password must have length from 8 to 24",
        state: password.length >= 8 && password.length <= 24,
      },
      {
        type: PasswordStateFieldType.StartsUppercase,
          text: "Password must start with uppercase latin letter",
          state: alphabetUppercase.some(char => password.startsWith(char)),
      },
      {
        type: PasswordStateFieldType.ContainsLatinLetters,
        text: "Password mush have at least one lowercase latin letter",
        state: alphabetLowercase.some(char => password.includes(char)),
      },
      {
        type: PasswordStateFieldType.ContainsNumbers,
        text: "Password mush have at least one digit",
        state: numbers.some(char => password.includes(char.toString())),
      },
      {
        type: PasswordStateFieldType.ContainsSpecialSymbols,
        text: "Password mush have at least one special symbol",
        state: specialSymbols.some(char => password.includes(char)),
      },
    ]
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

      const response: ApiResponse<Message> = (ex as any).response?.data;

      if (response && (response.statusCode === 401 || response.statusCode === 403)) {
          await store.dispatch("logout");
      }

      return (ex as any).response.data;
    }
  }
}

export default ApiService;
