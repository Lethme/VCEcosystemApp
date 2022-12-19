import { State } from "./state";
import {User} from "@/api/services/types";

const mutations = {
  setUserInfo(state: State, payload?: User) {
    state.user = payload;
  },
  setUserHasProfilePicture(state: State, payload: boolean) {
    state.hasProfilePicture = payload;
  },
};

export default mutations;
