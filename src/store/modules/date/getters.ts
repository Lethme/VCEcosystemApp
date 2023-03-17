import {formatDate} from "@/api/utils/formatDate";
import {Locale} from "@/store/modules/locales/types/Locale";
import { State } from "./state";
import moment from "moment";
import store from "@/store";

const getters = {
  date(state: State): Date {
    return state.date;
  },
  formattedDate(state: State): string {
    //return moment(state.date).format(store.getters.locale === Locale.Ru ? "DD.MM.YYYY, HH:mm:ss" : "MM.DD.YYYY, hh:mm:ss A");
    return formatDate(state.date);
  },
};

export default getters;
