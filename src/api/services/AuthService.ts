import ApiService from "@/api/services/ApiService";
import {ApiResponse, Auth, CreateUserDto, User} from "@/api/services/types";
import {Token} from "@/api/services/types/Token";
import axios from "axios";
import {Message} from "@/api/services/types/Message";

class AuthService extends ApiService {
    private static get Path(): string {
        return "auth";
    }

    static async Authorize(authData: Auth): Promise<ApiResponse<Token | Message> > {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, "login"],
        });

        return await this.Try<Token>(async () => {
            const response = await axios.post<ApiResponse<Token>>(url.Url, authData);
            const token = response.data.data?.token;

            if (token) {
                this.ApiToken = token;
            }

            return response.data;
        })
    }

    static async RegisterPrivate(dto: CreateUserDto): Promise<ApiResponse<User | Message>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, "register"],
        });

        return await this.Try<User>(async () => {
            const response = await axios.post<ApiResponse<User>>(url.Url, dto, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }
}

export default AuthService;