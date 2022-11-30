import {Action, ActionContext} from "vuex";
import { State } from "./state";

const actions = {
  async setLoading(context: ActionContext<State, any>, payload: boolean) {
    await context.commit("setLoadingState", payload);
  },
};

export default actions;
