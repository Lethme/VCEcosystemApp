import ApiService from "@/api/services/ApiService";
import {ApiResponse, App, Service} from "@/api/services/types";
import axios from "axios";
import {Message} from "@/api/services/types/Message";

class ServicesService extends ApiService {
    private static get Path(): string {
        return `services`;
    }

    static async GetAll(): Promise<ApiResponse<Array<Service> | Message> > {
        const url = this.CreateApiRequestUrl({
            path: [App.GKassa, this.Path],
        });

        return await this.Try<Array<Service>>(async () => {
            const response = await axios.get<ApiResponse<Array<Service>>>(url.Url);
            return response.data;
        });
    }
}

export default ServicesService;