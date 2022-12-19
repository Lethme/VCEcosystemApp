import { State } from "./state";
import {User} from "@/api/services/types";
import {ApiService} from "@/api/services";

const getters = {
  userInfo(state: State): User | undefined {
    return state.user;
  },
  hasProfilePicture(state: State): boolean {
    return state.hasProfilePicture;
  },
  authorized(state: State): boolean {
    return state.user !== undefined && ApiService.ApiToken !== null;
  }
};

export default getters;
