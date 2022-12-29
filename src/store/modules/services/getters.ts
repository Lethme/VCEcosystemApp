import { State } from "./state";

const getters = {
  services(state: State) {
    return state.services.filter(service => !service.deletedAt);
  },
  allServices(state: State) {
    return state.services;
  },
  removedServices(state: State) {
    return state.services.filter(service => service.deletedAt);
  },
  daysToRemoveOrders(state: State) {
    return state.daysToRemoveOrders;
  }
};

export default getters;
