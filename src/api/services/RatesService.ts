import ApiService from "@/api/services/ApiService";
import {ApiResponse, Rate} from "@/api/services/types";
import axios from "axios";
import {Message} from "@/api/services/types/Message";

class RatesService extends ApiService {
    private static get Path(): string {
        return "rates";
    }

    static async GetRatesPrivate(): Promise<ApiResponse<Array<Rate> | Message>> {
        const url = this.CreateApiRequestUrl({
            path: this.Path,
        });

        return await this.Try<Array<Rate>>(async () => {
            const response = await axios.get<ApiResponse<Array<Rate>>>(url.Url, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }
}

export default RatesService;