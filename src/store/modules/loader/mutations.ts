import { State } from "./state";

const mutations = {
  setLoadingState(state: State, payload: boolean) {
    if (state.loading && !payload) {
      setTimeout(() => state.loading = payload, 200);
    } else {
      state.loading = payload;
    }
  },
  setApiAvailableStatus(state: State, payload: boolean) {
    state.available = payload;
  },
};

export default mutations;
