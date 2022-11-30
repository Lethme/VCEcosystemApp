import { State } from "./state";

const getters = {
  windowWidth(state: State): number {
    return state.windowWidth;
  },
  windowHeight(state: State): number {
    return state.windowHeight;
  },
};

export default getters;
