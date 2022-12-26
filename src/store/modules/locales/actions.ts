import {UsersService} from "@/api/services";
import {Loader} from "@/utils";
import {Action, ActionContext} from "vuex";
import { State } from "./types/State";
import {Locale} from "@/store/modules/locales/types/Locale";

const actions = {
  async setLocale(context: ActionContext<State, any>, payload: Locale) {
    await Loader.Use(async () => {
      const response = await UsersService.SetLocale(payload);

      if (response.status) {
        await context.dispatch("updateUserInfo");
      }
    });
  },
};

export default actions;
