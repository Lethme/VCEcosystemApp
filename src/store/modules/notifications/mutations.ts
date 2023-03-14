import {Notification} from "@/api/services/types";
import state, {State} from "./state";

const mutations = {
    setNotifications(state: State, payload: Array<Notification>) {
        state.notifications = payload;
    },
    setRefreshIntervalId(state: State, payload: number) {
        state.refreshIntervalId = payload;
    },
    clearRefreshIntervalId(state: State) {
        clearInterval(state.refreshIntervalId);
        state.refreshIntervalId = undefined;
    }
};

export default mutations;
