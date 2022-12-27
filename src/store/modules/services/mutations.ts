import state, { State } from "./state";
import {Service} from "@/api/services/types";

const mutations = {
  setServices(state: State, payload: Array<Service>) {
    state.services = payload;
  },
  setDaysToRemoveOrders(state: State, payload: number) {
    state.daysToRemoveOrders = payload;
  }
};

export default mutations;
