import ApiService from "@/api/services/ApiService";
import {ApiResponse, App, ScheduleResponse, ShiftsExchange, ShiftsExchangeRequestDto} from "@/api/services/types";
import axios from "axios";
import {Message} from "@/api/services/types/Message";

class ShiftsExchangeService extends ApiService {
    private static get Path(): string {
        return "schedule/exchange";
    }

    static async GetRequests(month?: number, year?: number): Promise<ApiResponse<Array<ShiftsExchange> | Message>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path],
            query: {
                month: month ? month : (new Date()).getMonth(),
                year: year ? year : (new Date()).getFullYear()
            }
        });

        return await this.Try(async () => {
            const response = await axios.get<ApiResponse<Array<ShiftsExchange>>>(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async ResolveRequest(id: number, accept: boolean): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, 'resolve'],
            query: {id, accept},
        });

        return await this.Try(async () => {
            const response = await axios.post<ApiResponse>(url.Url, undefined, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }

    static async CreateRequest(dto: ShiftsExchangeRequestDto): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path],
        });

        return await this.Try(async () => {
            const response = await axios.post(url.Url, dto, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        })
    }
}

export default ShiftsExchangeService;