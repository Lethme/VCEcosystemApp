import {Action, ActionContext} from "vuex";
import { State } from "./state";

const actions = {
  async updateDate(context: ActionContext<State, any>) {
    context.commit("setDate", new Date());
  },
};

export default actions;
