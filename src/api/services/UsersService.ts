import ApiService from "@/api/services/ApiService";
import {ApiResponse, PatchUserDto, SetProfilePicture, User} from "@/api/services/types";
import axios from "axios";
import {Message} from "@/api/services/types/Message";

class UsersService extends ApiService {
    private static get Path(): string {
        return "users";
    }
    private static get ConfirmPath(): string {
        return "confirm";
    }

    static async GetUserByUUID(uuid: string): Promise<ApiResponse<User | Message>> {
        const url = this.CreateApiRequestUrl({
            path: [this.ConfirmPath, uuid],
        });

        return await this.Try<User>(async () => {
            const response = await axios.get<ApiResponse<User>>(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        })
    }

    static async ConfirmUserByUUID(uuid: string, password: string): Promise<ApiResponse<User | Message>> {
        const url = this.CreateApiRequestUrl({
            path: [this.ConfirmPath, uuid],
        });

        return await this.Try<User>(async () => {
            const response = await axios.post<ApiResponse<User>>(url.Url, { password }, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        })
    }

    static async WhoAmI(): Promise<ApiResponse<User | Message>> {
        const url = this.CreateApiRequestUrl({
            path: this.Path,
            query: { me: true },
        });

        return await this.Try<User>(async () => {
            const response = await axios.get<ApiResponse<User>>(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        })
    }

    static async EditUserData(dto: PatchUserDto): Promise<ApiResponse<User | Message>> {
        const url = this.CreateApiRequestUrl({
            path: this.Path,
        });

        return await this.Try<User>(async () => {
            const response = await axios.patch<ApiResponse<User>>(url.Url, dto, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async SetProfilePicture(dto: SetProfilePicture): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, 'picture'],
        });

        return await this.Try(async () => {
            const response = await axios.post<ApiResponse<undefined>>(url.Url, dto, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        })
    }

    static async HasProfilePicture(uuid: string): Promise<boolean> {
        const picUrl = this.GetProfilePicturePath(uuid);

        try {
            await axios.head(picUrl);
            return true;
        } catch {
            return false;
        }
    }
}

export default UsersService;