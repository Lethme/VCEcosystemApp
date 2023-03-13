import ApiService from "@/api/services/ApiService";
import {ApiResponse, Auth, CreateUserDto, User} from "@/api/services/types";
import {Token} from "@/api/services/types/Token";
import axios from "axios";
import {Message} from "@/api/services/types/Message";

class BotService extends ApiService {
    private static get Path(): string {
        return "bot";
    }

    static async SendMessagePrivate(dto: { userIds: Array<number>, message: string }): Promise<ApiResponse<Message | undefined>> {
        const url = this.CreateApiRequestUrl({
            path: [this.Path, 'message', 'group'],
        });

        return await this.Try(async () => {
            const response = await axios.post(url.Url, dto, {
                headers: this.ApiRequestHeaders,
            });

            return response.data;
        });
    }
}

export default BotService;