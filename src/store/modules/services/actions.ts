import store from "@/store";
import {Pane} from "@/store/modules/orders/types";
import {Action, ActionContext} from "vuex";
import { State } from "./state";
import {Loader} from "@/utils";
import {OrdersService, ServicesService} from "@/api/services";
import {DaysToRemoveOrders, Service} from "@/api/services/types";

const actions = {
  async updateServices(context: ActionContext<State, any>) {
    const response = await ServicesService.GetAll();

    if (response.status) {
      context.commit("setServices", response.data);

      const panes: Array<Pane> = store.getters.panes;
      const services = response.data as Array<Service>;

      for (let i = 0; i < panes.length; i++) {
        const pane = panes[i];

        for (let j = 0; j < pane.order.dataSource.length; j++) {
          const item = pane.order.dataSource[j];
          const service = services.find(s => s.id === item.id);

          if (service && item.price !== service.price) {
            item.price = service.price;
            item.totalPrice = item.price * item.amount;
          }
        }
      }

      store.commit("saveState");
    }
  },
  async updateDaysToRemoveOrders(context: ActionContext<State, any>) {
    const response = await OrdersService.GetDaysToRemove();

    if (response.status) {
      context.commit("setDaysToRemoveOrders", (response.data as DaysToRemoveOrders).days);
    }
  },
};

export default actions;
