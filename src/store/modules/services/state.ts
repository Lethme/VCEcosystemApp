import {Service} from "@/api/services/types";

export interface State {
  services: Array<Service>;
}

const state: State = {
  services: [],
};

export default state;
