import {NewOrder} from "@/api/services/types";
import {DataItem} from "@/store/modules/orders/types/DataItem";

export interface OrderData {
    selectedService?: number;
    dataSource: Array<DataItem>;
    dataEditable: Record<string, DataItem>;
    summaryActiveKeys: Array<string>;
    cash: number;
}

export class OrderState {
    public selectedService?: number = undefined;
    public dataSource: Array<DataItem> = [];
    public dataEditable: Record<string, DataItem> = {};
    public summaryActiveKeys: Array<string> = [];
    public cash = 0;

    constructor(orderData?: OrderData) {
        if (orderData) {
            this.selectedService = orderData.selectedService;
            this.dataSource = orderData.dataSource;
            this.dataEditable = orderData.dataEditable;
            this.summaryActiveKeys = orderData.summaryActiveKeys;
            this.cash = orderData.cash;
        }
    }

    public get empty() {
        return this.dataSource.length === 0;
    }

    public get change() {
        return this.cash - this.totalPrice;
    }

    public get groupedDataSource() {
        const resultDataSource: Array<DataItem> = [];

        for (let i = 0; i < this.dataSource.length; i++) {
            const item = this.dataSource[i];
            const groupedItemIndex = resultDataSource.findIndex(resultItem => resultItem.id === item.id);

            if (groupedItemIndex !== -1) {
                resultDataSource[groupedItemIndex].amount += item.amount * (item.multiplier ?? 1);
                resultDataSource[groupedItemIndex].totalPrice += item.totalPrice;
            } else {
                resultDataSource.push({ ...item, amount: item.amount * (item.multiplier ?? 1) });
            }
        }

        return resultDataSource;
    }

    public get uploadDataSource(): NewOrder {
        return {
            moneyReceived: this.cash,
            services: this.groupedDataSource.map(service => ({
                serviceId: service.id,
                amount: service.amount,
            })),
        };
    }

    public get totalPrice() {
        return this.dataSource.map(item => item.totalPrice).reduce((cur, next) => cur + next);
    }

    public getItemByKey(key: string) {
        return this.dataSource.find(item => item.key === key);
    }

    public getItemIndexByKey(key: string) {
        return this.dataSource.findIndex(item => item.key === key);
    }

    public clear() {
        this.selectedService = undefined;
        this.dataSource = [];
        this.dataEditable = {};
        this.summaryActiveKeys = [];
        this.cash = 0;
    }
}