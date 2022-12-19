import {User} from "@/api/services/types";

export interface State {
  user?: User;
  hasProfilePicture: boolean;
}

const state: State = {
  user: undefined,
  hasProfilePicture: false,
};

export default state;
