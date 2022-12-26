import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";
import {Locale} from "@/store/modules/locales/types/Locale";
import {locales} from "@/store/modules/locales/locales"

export interface State {
    locale: Locale;
    readonly locales: typeof locales;
}