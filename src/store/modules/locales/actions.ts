import {Action, ActionContext} from "vuex";
import { State } from "./types/State";
import {Locale} from "@/store/modules/locales/types/Locale";

const actions = {
  async setLocale(context: ActionContext<State, any>, payload: Locale) {
    context.commit("setLocale", payload);
  },
};

export default actions;
