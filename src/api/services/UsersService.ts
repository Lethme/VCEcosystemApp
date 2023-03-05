import ApiService from "@/api/services/ApiService";
import {
    ApiResponse,
    CreatePreferenceDto,
    CreateUserDto, EditPreferenceDto,
    EditUserDto,
    SetProfilePicture,
    Token,
    User
} from "@/api/services/types";
import {Locale} from "@/store/modules/locales/types/Locale";
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

    static async GetUsersPrivate(): Promise<ApiResponse<Array<User> | Message>> {
        const url = this.CreateApiRequestUrl({
            path: this.Path
        });

        return await this.Try<Array<User>>(async () => {
            const response = await axios.get<ApiResponse<Array<User>>>(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async DisableUserAccountPrivate(id: number): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, 'disable', id]
        });

        return await this.Try(async () => {
            const response = await axios.delete<ApiResponse>(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async EditUserPrivate(id: number, dto: EditUserDto): Promise<ApiResponse<User | Message>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, id],
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

    static async SetLocale(locale: Locale): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, 'locale'],
        });

        return await this.Try(async () => {
            const response = await axios.post<ApiResponse<undefined>>(url.Url, { locale }, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
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

    static async AddPreference(dto: CreatePreferenceDto): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, 'preferences'],
        });

        return await this.Try(async () => {
            const response = await axios.post<ApiResponse>(url.Url, dto, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async EditPreference(id: number, dto: EditPreferenceDto): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, 'preferences', id],
        });

        return await this.Try(async () => {
            const response = await axios.patch<ApiResponse>(url.Url, dto, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async RemovePreference(id: number): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, 'preferences', id],
        });

        return await this.Try(async () => {
            const response = await axios.delete<ApiResponse>(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async UnlinkTelegramAccount(): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, 'telegram', 'unlink']
        });

        return await this.Try(async () => {
            const response = await axios.get(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }
}

export default UsersService;