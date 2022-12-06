import { State } from "./state";
import {User} from "@/api/services/types";

const getters = {
  userInfo(state: State): User | undefined {
    return state.user;
  },
  authorized(state: State): boolean {
    return state.user !== undefined;
  }
};

export default getters;
