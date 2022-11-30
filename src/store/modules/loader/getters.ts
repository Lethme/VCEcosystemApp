import { State } from "./state";

const getters = {
  loading(state: State): boolean {
    return state.loading;
  }
};

export default getters;
