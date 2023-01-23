import { State } from "./state";

const mutations = {
  setLoadingState(state: State, payload: boolean) {
    state.loading = payload;
  },
  setApiAvailableStatus(state: State, payload: boolean) {
    state.available = payload;
  },
};

export default mutations;
