import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";
import {Locale} from "@/store/modules/locales/types/Locale";

export interface State {
    locale: Locale;
    ru: LocaleRecord;
    en: LocaleRecord;
}