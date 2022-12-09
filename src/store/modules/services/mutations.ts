import state, { State } from "./state";
import {Service} from "@/api/services/types";

const mutations = {
  setServices(state: State, payload: Array<Service>) {
    state.services = payload.sort((f, s) => f.id - s.id);
  },
};

export default mutations;
