import {Action, ActionContext} from "vuex";
import { State } from "./state";

const actions = {
  async updateWindowWidth(context: ActionContext<State, any>) {
    await context.commit("setWindowWidth", window.innerWidth);
  },
  async updateWindowHeight(context: ActionContext<State, any>) {
    await context.commit("setWindowHeight", window.innerHeight);
  },
  async updateWindowSize(context: ActionContext<State, any>) {
    await context.commit("setWindowWidth", window.innerWidth);
    await context.commit("setWindowHeight", window.innerHeight);
  }
};

export default actions;
