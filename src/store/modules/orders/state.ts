import {Pane, PaneJSON} from "@/store/modules/orders/types";

export interface State {
  panes: Array<Pane>;
  activeKey?: string;
  tabIndex: number;
}

export interface StateJSON {
  panes: Array<PaneJSON>;
  activeKey?: string;
  tabIndex: number;
}

const state: State = {
  panes: [],
  activeKey: undefined,
  tabIndex: 1,
};

export default state;
