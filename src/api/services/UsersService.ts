import ApiService from "@/api/services/ApiService";
import {ApiResponse, User} from "@/api/services/types";
import axios from "axios";
import {Message} from "@/api/services/types/Message";

class UsersService extends ApiService {
    private static get Path(): string {
        return "users";
    }

    static async WhoAmI(): Promise<ApiResponse<User | Message>> {
        const url = this.CreateApiRequestUrl({
            path: this.Path,
            query: { me: true },
        });

        return await this.Try<User>(async () => {
            const response = await axios.get<ApiResponse<User>>(url.Url, {
                headers: {
                    "Authorization": `Bearer ${this.ApiToken || ""}`
                }
            });

            return response.data;
        })
    }
}

export default UsersService;