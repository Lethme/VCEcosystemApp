import { State } from "./state";
import {User} from "@/api/services/types";

const getters = {
  userInfo(state: State): User | undefined {
    return state.user;
  },
};

export default getters;
