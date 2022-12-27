import ApiService from "@/api/services/ApiService";
import {ApiResponse, App, PatchServiceDto, PostServiceDto, Service} from "@/api/services/types";
import axios from "axios";
import {Message} from "@/api/services/types/Message";

class ServicesService extends ApiService {
    private static get Path(): string {
        return `services`;
    }

    static async GetAll(): Promise<ApiResponse<Array<Service> | Message>> {
        const url = this.CreateApiRequestUrl({
            path: [App.GKassa, this.Path],
        });

        return await this.Try<Array<Service>>(async () => {
            const response = await axios.get<ApiResponse<Array<Service>>>(url.Url);
            return response.data;
        });
    }

    static async RemoveServicePrivate(id: number): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [App.GKassa, this.Path, id],
        });

        return await this.Try(async () => {
            const response = await axios.delete<ApiResponse>(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async CreateServicePrivate(dto: PostServiceDto): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [App.GKassa, this.Path],
        });

        return await this.Try(async () => {
            const response = await axios.post(url.Url, dto, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async EditServicePrivate(id: number, dto: PatchServiceDto): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [App.GKassa, this.Path, id],
        });

        return await this.Try(async () => {
            const response = await axios.patch(url.Url, dto, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }
}

export default ServicesService;