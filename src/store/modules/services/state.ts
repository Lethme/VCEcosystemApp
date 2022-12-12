import {Service} from "@/api/services/types";

export interface State {
  services: Array<Service>;
  daysToRemoveOrders: number;
}

const state: State = {
  services: [],
  daysToRemoveOrders: -1,
};

export default state;
