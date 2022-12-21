import {State} from "./types/State";
import {Locale} from "@/store/modules/locales/types/Locale";
import {ru} from "@/store/modules/locales/ru";
import {en} from "@/store/modules/locales/en";

const state: State = {
  locale: Locale.Ru,
  ru, en,
};

export default state;
