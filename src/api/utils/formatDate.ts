import store from "@/store";
import {Locale} from "@/store/modules/locales/types/Locale";
import moment from "moment";

export const formatDate = (date: Date) => {
    return moment(date).format(store.getters.locale === Locale.Ru ? "DD.MM.YYYY, HH:mm:ss" : "MM.DD.YYYY, hh:mm:ss A");
}