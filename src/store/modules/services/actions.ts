import {Action, ActionContext} from "vuex";
import { State } from "./state";
import {Loader} from "@/utils";
import {OrdersService, ServicesService} from "@/api/services";
import {DaysToRemoveOrders} from "@/api/services/types";

const actions = {
  async updateServices(context: ActionContext<State, any>) {
    await Loader.Use(async () => {
      const response = await ServicesService.GetAll();

      if (response.status) {
        context.commit("setServices", response.data);
      }
    });
  },
  async updateDaysToRemoveOrders(context: ActionContext<State, any>) {
    await Loader.Use(async () => {
      const response = await OrdersService.GetDaysToRemove();

      if (response.status) {
        context.commit("setDaysToRemoveOrders", (response.data as DaysToRemoveOrders).days);
      }
    });
  },
};

export default actions;
