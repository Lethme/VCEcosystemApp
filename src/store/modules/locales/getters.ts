import { State } from "./types/State";
import {Locale} from "@/store/modules/locales/types/Locale";
import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";

const getters = {
  locale(state: State): Locale {
    return state.locale;
  },
  localeRecord(state: State): LocaleRecord {
    return state.locales[state.locale];
  },
  localeRecords(state: State): Array<LocaleRecord> {
    return Object.values(state.locales);
  },
};

export default getters;
