import store from "@/store";
import {Locale} from "@/store/modules/locales/types/Locale";
import moment from "moment";

export const formatDate = (date: Date) => {
    //return moment(date).format(store.getters.locale === Locale.Ru ? "DD.MM.YYYY, HH:mm:ss" : "MM.DD.YYYY, hh:mm:ss A");
    return (new Date(date)).toLocaleString(store.getters.locale, { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: store.getters.locale !== Locale.Ru });
}