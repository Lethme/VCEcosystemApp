import { State } from "./state";

const getters = {
  services(state: State) {
    return state.services;
  },
  daysToRemoveOrders(state: State) {
    return state.daysToRemoveOrders;
  }
};

export default getters;
