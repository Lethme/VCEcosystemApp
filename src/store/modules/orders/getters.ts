import { State } from "./state";
import {Pane} from "@/store/modules/orders/types";

const getters = {
  panes(state: State): Array<Pane> {
    return state.panes;
  },
  activePane(state: State): Pane | undefined {
    return state.panes.find(pane => pane.key === state.activeKey);
  },
  activeKey(state: State): string | undefined {
    return state.activeKey;
  },
  tabIndex(state: State): number {
    return state.tabIndex;
  },
};

export default getters;
