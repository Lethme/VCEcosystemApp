import {Url} from "@/api/services";
import {ApiResponse, Environment, PasswordState, PasswordStateFieldType} from "@/api/services/types";
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
import {RouteLocationNormalizedLoaded, Router} from "vue-router";
import router from "@/router";

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

    protected static get Router(): Router {
        return router;
    }

    protected static get Route(): RouteLocationNormalizedLoaded {
        return router.currentRoute.value;
    }

    public static get Env(): Environment {
        return process.env.NODE_ENV;
    }

    public static get BotName(): string {
        return ApiService.Env === Environment.Production ? 'VCNotifyBot' : 'VCNotifyDevBot';
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
                text: "Пароль должен содержать от 8 до 24 символов включительно",
                state: password.length >= 8 && password.length <= 24,
            },
            {
                type: PasswordStateFieldType.StartsUppercase,
                text: "Пароль должен начинаться с заглавной латинской буквы",
                state: alphabetUppercase.some(char => password.startsWith(char)),
            },
            {
                type: PasswordStateFieldType.ContainsLatinLetters,
                text: "Пароль должен содержать хотя бы одну строчную латинскую букву",
                state: alphabetLowercase.some(char => password.includes(char)),
            },
            {
                type: PasswordStateFieldType.ContainsNumbers,
                text: "Пароль должен содержать хотя бы одну цифру",
                state: numbers.some(char => password.includes(char.toString())),
            },
            {
                type: PasswordStateFieldType.ContainsSpecialSymbols,
                text: "Пароль дожен содержать хотя бы один специальный символ",
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
            const response = await callback();
            store.commit("setApiAvailableStatus", true);
            return response;
        } catch (ex) {
            console.log(ex);

            if ((ex as any).code && (ex as any).code === 'ERR_NETWORK') {
                store.commit("setApiAvailableStatus", false);
                await this.Router.push({
                    path: '/error',
                    query: {
                        redirect: this.Route.query.redirect ?? this.Route.fullPath,
                    }
                });

                return ex as any;
            }

            const response: ApiResponse<Message> = (ex as any).response?.data;

            if (response && (response.statusCode === 401 || response.statusCode === 403)) {
                await store.dispatch("logout");
            }

            if (response && response.statusCode === 500) {
                store.commit("setApiAvailableStatus", false);
                await this.Router.push({
                    path: '/error',
                    query: {
                        redirect: this.Route.query.redirect ?? this.Route.fullPath,
                    }
                })

                return ex as any;
            }

            return (ex as any).response.data;
        }
    }
}

export default ApiService;
