import { State } from "./types/State";
import {Locale} from "@/store/modules/locales/types/Locale";

const mutations = {
  setLocale(state: State, payload: Locale) {
    state.locale = payload;
  },
};

export default mutations;
