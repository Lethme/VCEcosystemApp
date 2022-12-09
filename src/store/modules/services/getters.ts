import { State } from "./state";

const getters = {
  services(state: State) {
    return state.services;
  },
};

export default getters;
