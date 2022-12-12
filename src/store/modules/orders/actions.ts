import {User} from "@/api/services/types";
import store from "@/store";
import { isAuthorized } from "@/utils";
import { ActionContext } from "vuex";
import { State } from "./state";

const actions = {
  async paneAction(context: ActionContext<State, any>, payload: { key: string | MouseEvent, action: string }) {
    if (payload.action === 'add') {
      context.commit("addPane")
    } else {
      context.commit("removePane", payload.key as string);
    }
  },
  async clearOrder(context: ActionContext<State, any>) {
    context.commit("clearOrder");
  },
  async saveState(context: ActionContext<State, any>) {
    context.commit("saveState");
  },
  async loadState(context: ActionContext<State, any>) {
    context.commit("loadState");
  },
  async clearState(context: ActionContext<State, any>) {
    context.commit("clearState");
  }
};

export default actions;
