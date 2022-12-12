import { State } from "./state";

const mutations = {
  setLoadingState(state: State, payload: boolean) {
    state.loading = payload;
  }
};

export default mutations;
