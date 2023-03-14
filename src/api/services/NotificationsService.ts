import ApiService from "@/api/services/ApiService";
import {ApiResponse, Auth, CreateUserDto, Notification, User} from "@/api/services/types";
import {Token} from "@/api/services/types/Token";
import axios from "axios";
import {Message} from "@/api/services/types/Message";

class NotificationsService extends ApiService {
    private static get Path(): string {
        return "notifications";
    }

    static async GetAll(): Promise<ApiResponse<Array<Notification> | Message>> {
        const url = this.CreateApiRequestUrl({
            path: this.Path,
        });

        return await this.Try<Array<Notification>>(async () => {
            const response = await axios.get<ApiResponse<Array<Notification>>>(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async ReadAll(): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, 'read'],
        });

        return await this.Try(async () => {
            const response = await axios.get(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async Read(id: number): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, 'read', id],
        });

        return await this.Try(async () => {
            const response = await axios.get(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async RemoveAll(): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: this.Path,
        });

        return await this.Try(async () => {
            const response = await axios.delete(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async Remove(id: number): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, id],
        });

        return await this.Try(async () => {
            const response = await axios.delete(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }
}

export default NotificationsService;