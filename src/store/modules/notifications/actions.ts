import {NotificationsService} from "@/api/services";
import {Action, ActionContext} from "vuex";
import {State} from "./state";

const actions = {
    async updateNotifications(context: ActionContext<State, any>) {
        const response = await NotificationsService.GetAll();

        if (response && response.status) {
            context.commit("setNotifications", response.data);
        }
    },
};

export default actions;
