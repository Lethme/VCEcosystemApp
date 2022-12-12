import Timestamp from "@/api/services/types/Timestamp";
import User from "@/api/services/types/User";
import {OrderService} from "@/api/services/types/OrderService";

export interface Order extends Timestamp {
    id: number;
    moneyReceived: number;
    user: User;
    services: Array<OrderService>;
}