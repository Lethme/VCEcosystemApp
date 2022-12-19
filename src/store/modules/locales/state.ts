import {State} from "./types/State";
import {Locale} from "@/store/modules/locales/types/Locale";

const state: State = {
  locale: Locale.Ru,
  ru: {
    test: "123",
  },
  en: {
    test: "456",
  }
};

export default state;
