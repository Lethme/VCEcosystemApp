import {Ref} from "vue";
import {OrderData, OrderState} from "@/store/modules/orders/types/OrderState";

export interface Pane {
    title: string;
    key: string;
    order: OrderState;
}

export interface PaneJSON {
    title: string;
    key: string;
    order: OrderData
}