import state, { State } from "./state";

const mutations = {
  setDate(state: State, payload: Date) {
    state.date = payload;
  },
};

export default mutations;
