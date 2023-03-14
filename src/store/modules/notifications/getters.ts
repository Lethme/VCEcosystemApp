import {Notification} from "@/api/services/types";
import {Locale} from "@/store/modules/locales/types/Locale";
import {State} from "./state";
import moment from "moment";
import store from "@/store";

const getters = {
    notifications(state: State): Array<Notification> {
        return state.notifications;
    },
    readNotifications(state: State): Array<Notification> {
        return state.notifications.filter(notification => notification.read);
    },
    unreadNotifications(state: State): Array<Notification> {
        return state.notifications.filter(notification => !notification.read);
    },
    refreshIntervalId(state: State): number | undefined {
        return state.refreshIntervalId;
    }
};

export default getters;
