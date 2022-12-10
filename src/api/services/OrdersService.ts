import ApiService from "@/api/services/ApiService";
import {ApiResponse, App, DaysToRemoveOrders, Order} from "@/api/services/types";
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

    static async GetDaysToRemove(): Promise<ApiResponse<DaysToRemoveOrders | Message>> {
        const url = this.CreateApiRequestUrl({
            path: [App.GKassa, this.Path, "days"],
        });

        return await this.Try<DaysToRemoveOrders>(async () => {
            const response = await axios.get<ApiResponse<DaysToRemoveOrders>>(url.Url);

            return response.data;
        })
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

    static async Remove(id: number, force = false): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [App.GKassa, this.Path, id],
            query: { force }
        });

        return await this.Try(async () => {
            const response = await axios.delete<ApiResponse>(url.Url, {
                headers: {
                    "Authorization": `Bearer ${this.ApiToken || ""}`
                }
            });

            return response.data;
        })
    }

    static async Restore(id: number): Promise<ApiResponse<Message | Order>> {
        const url = this.CreateApiRequestUrl({
            path: [App.GKassa, this.Path, id],
        });

        return await this.Try<Order>(async () => {
            const response = await axios.patch<ApiResponse<Order>>(url.Url, {}, {
                headers: {
                    "Authorization": `Bearer ${this.ApiToken || ""}`
                }
            });

            return response.data;
        })
    }
}

export default OrdersService;