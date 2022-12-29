import ApiService from "@/api/services/ApiService";
import {ApiResponse, CreateRateDto, Rate} from "@/api/services/types";
import axios from "axios";
import {Message} from "@/api/services/types/Message";
import {EditRateDto} from "@/api/services/types/EditRateDto";

class RatesService extends ApiService {
    private static get Path(): string {
        return "rates";
    }

    static async CreateRatePrivate(dto: CreateRateDto): Promise<ApiResponse<Rate | Message>> {
        const url = this.CreateApiRequestUrl({
            path: this.Path,
        });

        return await this.Try<Rate>(async () => {
            const response = await axios.post<ApiResponse<Rate>>(url.Url, dto, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async EditRatePrivate(id: number, dto: EditRateDto): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, id],
        });

        return await this.Try(async () => {
            const response = await axios.patch<ApiResponse>(url.Url, dto, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async GetRatesPrivate(force?: boolean): Promise<ApiResponse<Array<Rate> | Message>> {
        const url = this.CreateApiRequestUrl({
            path: this.Path,
            query: { force },
        });

        return await this.Try<Array<Rate>>(async () => {
            const response = await axios.get<ApiResponse<Array<Rate>>>(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async RemoveRatePrivate(id: number, force?: boolean): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, id],
            query: { force },
        });

        return await this.Try(async () => {
            const response = await axios.delete<ApiResponse>(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async RestoreRatePrivate(id: number): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, 'restore', id],
        });

        return await this.Try(async () => {
            const response = await axios.patch<ApiResponse>(url.Url, null, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }
}

export default RatesService;