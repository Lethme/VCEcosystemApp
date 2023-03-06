import ApiService from "@/api/services/ApiService";
import {ApiResponse, App, ScheduleResponse} from "@/api/services/types";
import axios from "axios";
import {Message} from "@/api/services/types/Message";

class ScheduleService extends ApiService {
    private static get Path(): string {
        return "schedule";
    }

    static async Get(month?: number, year?: number): Promise<ApiResponse<ScheduleResponse | Message>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path],
            query: {
                month: month ? month : (new Date()).getMonth(),
                year: year ? year : (new Date()).getFullYear()
            }
        });

        return await this.Try<ScheduleResponse>(async () => {
            const response = await axios.get<ApiResponse<ScheduleResponse>>(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }
}

export default ScheduleService;