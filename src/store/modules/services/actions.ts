import {Action, ActionContext} from "vuex";
import { State } from "./state";
import {Loader} from "@/utils";
import ServicesService from "@/api/services/ServicesService";

const actions = {
  async updateServices(context: ActionContext<State, any>) {
    await Loader.Use(async () => {
      const response = await ServicesService.GetAll();

      if (response.status) {
        context.commit("setServices", response.data);
      }
    });
  },
};

export default actions;
