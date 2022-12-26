import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";
import {isAuthorized} from "@/utils";
import {State, StateJSON} from "./state";
import {OrderState, Pane} from "@/store/modules/orders/types";
import {cloneDeep} from "lodash-es";
import {Service, User} from "@/api/services/types";
import store from "@/store";

const mutations = {
  loadState(state: State) {
    if (isAuthorized()) {
      const user: User = store.getters.userInfo;

      try {
        const storedStateJson = localStorage.getItem(`temp_orders_${user.id}`);

        if (storedStateJson) {
          const storedState: StateJSON = JSON.parse(storedStateJson);
          state.panes = storedState.panes.map(pane => {
            return {
              title: pane.title,
              key: pane.key,
              order: new OrderState(pane.order),
            };
          });
          state.tabIndex = storedState.tabIndex;
          state.activeKey = storedState.activeKey;

          store.commit('localizeOrders');
          store.commit('saveState');
        }
      } catch {
        localStorage.removeItem(`temp_orders_${user.id}`);
      }
    }
  },
  localizeOrders(state: State) {
    state.panes = state.panes.map(pane => {
      const tabIndex = pane.key.split("newOrder")[1];
      return {
        ...pane,
        title: `${(store.getters.localeRecord as LocaleRecord).newOrdersPage.newOrderTitle} (${tabIndex})`,
      }
    });

    store.commit("saveState");
  },
  saveState(state: State) {
    if (isAuthorized()) {
      const user: User = store.getters.userInfo;
      localStorage.setItem(`temp_orders_${user.id}`, JSON.stringify(state));
    }
  },
  clearState(state: State) {
    state.panes = [];
    state.activeKey = undefined;
    state.tabIndex = 1;
  },
  setActiveKey(state: State, payload?: string) {
    state.activeKey = payload;
    store.commit("saveState");
  },
  addPane(state: State) {
    state.activeKey = `newOrder${state.tabIndex}`;
    state.panes.push({
      title: `${(store.getters.localeRecord as LocaleRecord).newOrdersPage.newOrderTitle} (${state.tabIndex})`,
      key: state.activeKey,
      order: new OrderState(),
    });
    state.tabIndex += 1;
    store.commit("saveState");
  },
  removePane(state: State, payload: string) {
    if (state.panes.length === 1) {
      state.tabIndex = 2;
      state.panes[0].key = "newOrder1";
      state.panes[0].title = `${(store.getters.localeRecord as LocaleRecord).newOrdersPage.newOrderTitle} (1)`;
      state.panes[0].order = new OrderState();
      state.activeKey = state.panes[0].key;
      store.commit("saveState");

      return;
    }

    let lastIndex = 0;
    state.panes.forEach((pane, i) => {
      if (pane.key === payload) {
        lastIndex = i - 1;
      }
    });
    state.panes = state.panes.filter(pane => pane.key !== payload);
    if (state.panes.length && state.activeKey === payload) {
      if (lastIndex >= 0) {
        state.activeKey = state.panes[lastIndex].key;
      } else {
        state.activeKey = state.panes[0].key;
      }
    }
    if (state.panes.length) {
      const maxTabIndex = Math.max(...state.panes.map(pane => +(pane.key.split("newOrder")[1])));
      state.tabIndex = maxTabIndex + 1;
    }
    store.commit("saveState");
  },
  clearOrder(state: State) {
    const activePane = state.panes.find(pane => pane.key === state.activeKey);

    if (activePane) {
      activePane.order.clear();
      store.commit("saveState");
    }
  },
  editOrderServiceAmount(state: State, payload: string) {
    const activePane = state.panes.find(pane => pane.key === state.activeKey);

    if (activePane) {
      activePane.order.dataEditable[payload] = cloneDeep(activePane.order.dataSource.filter(item => payload === item.key)[0]);
      store.commit("saveState");
    }
  },
  saveOrderServiceAmount(state: State, payload: string) {
    const activePane = state.panes.find(pane => pane.key === state.activeKey);

    if (activePane) {
      Object.assign(activePane.order.dataSource.filter(item => payload === item.key)[0], activePane.order.dataEditable[payload]);
      delete activePane.order.dataEditable[payload];

      const itemIndex = activePane.order.getItemIndexByKey(payload);
      if (itemIndex !== -1) {
        activePane.order.dataSource[itemIndex].totalPrice = activePane.order.dataSource[itemIndex].amount * activePane.order.dataSource[itemIndex].price;
      }

      store.commit("saveState");
    }
  },
  cancelOrderServiceAmount(state: State, payload: string) {
    const activePane = state.panes.find(pane => pane.key === state.activeKey);

    if (activePane && activePane.order.dataEditable[payload]) {
      delete activePane.order.dataEditable[payload];
    }
  },
  addOrderService(state: State) {
    const activePane = state.panes.find(pane => pane.key === state.activeKey);

    if (activePane && activePane.order.selectedService) {
      const service: Service = store.getters.services.find((s: Service) => s.id === activePane.order.selectedService);

      activePane.order.dataSource.push({
        key: activePane.order.dataSource.length.toString(),
        id: service.id,
        title: service.title,
        price: service.price,
        totalPrice: service.price,
        amount: 1,
      });

      store.commit("saveState");
    }
  },
  deleteOrderService(state: State, payload: string) {
    const activePane = state.panes.find(pane => pane.key === state.activeKey);

    if (activePane) {
      activePane.order.dataSource = activePane.order.dataSource.filter(item => item.key !== payload);
      store.commit("saveState");
    }
  }
};

export default mutations;
