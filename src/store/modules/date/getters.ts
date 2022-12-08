import { State } from "./state";
import moment from "moment";

const getters = {
  date(state: State): Date {
    return state.date;
  },
  formattedDate(state: State): string {
    return moment(state.date).format("DD.MM.YYYY | HH:mm:ss");
  },
};

export default getters;
