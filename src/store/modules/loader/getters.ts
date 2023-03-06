import { State } from "./state";

const getters = {
  loading(state: State): boolean {
    return state.loading;
  },
  available(state: State): boolean {
    return state.available;
  }
};

export default getters;
