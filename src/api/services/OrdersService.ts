import ApiService from "@/api/services/ApiService";
import {ApiResponse, App, Order} from "@/api/services/types";
import axios from "axios";
import {Message} from "@/api/services/types/Message";

interface SelectOrdersQuery {
    deleted?: boolean;
    offset?: number;
    limit?: number;
}

class OrdersService extends ApiService {
    private static get Path(): string {
        return `orders`;
    }

    static async GetAll(query?: SelectOrdersQuery): Promise<ApiResponse<Array<Order> | Message> > {
        const url = this.CreateApiRequestUrl({
            path: [App.GKassa, this.Path],
            query,
        });

        return await this.Try<Array<Order>>(async () => {
            const response = await axios.get<ApiResponse<Array<Order>>>(url.Url, {
                headers: {
                    "Authorization": `Bearer ${this.ApiToken || ""}`
                }
            });

            return response.data;
        })
    }
}

export default OrdersService;