export interface NewOrderService {
    serviceId: number;
    amount: number;
}

export interface NewOrder {
    moneyReceived: number;
    services: Array<NewOrderService>;
}