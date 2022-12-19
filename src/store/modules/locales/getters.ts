import { State } from "./types/State";
import {Locale} from "@/store/modules/locales/types/Locale";
import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";

const getters = {
  locale(state: State): Locale {
    return state.locale;
  },
  localeRecord(state: State): LocaleRecord {
    return state[state.locale];
  },
};

export default getters;
