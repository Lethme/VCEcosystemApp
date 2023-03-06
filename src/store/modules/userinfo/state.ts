import {User} from "@/api/services/types";

export interface State {
  user?: User;
}

const state: State = {
  user: undefined,
};

export default state;
