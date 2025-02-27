import {Action, ActionContext} from "vuex";
import { State } from "./state";

const actions = {
  async setLoading(context: ActionContext<State, any>, payload: boolean) {
    context.commit("setLoadingState", payload);
  },
};

export default actions;
