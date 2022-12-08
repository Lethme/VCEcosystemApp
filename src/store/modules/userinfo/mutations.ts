import { State } from "./state";
import {User} from "@/api/services/types";

const mutations = {
  setUserInfo(state: State, payload?: User) {
    state.user = payload;
  },
};

export default mutations;
