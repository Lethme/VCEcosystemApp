import store from "@/store";
import {Locale} from "@/store/modules/locales/types/Locale";
import {ActionContext} from "vuex";
import {State} from "./state";
import {ApiService, UsersService} from "@/api/services";
import {ApiResponse, User} from "@/api/services/types";
import {Message} from "@/api/services/types/Message";
import {isAuthorized} from "@/utils";
import router from "@/router";

const actions = {
    async updateUserInfo(context: ActionContext<State, any>) {
        const token = localStorage.getItem("api_token");

        if (token) {
            const response = await UsersService.WhoAmI();

            if (!response.status || !response) {
                console.log((response as ApiResponse<Message>).data?.message);

                localStorage.removeItem("api_token");
                context.commit("setUserInfo", undefined);

                await router.push({
                    name: "login",
                    state: {
                        exception: "Время сеанса истекло",
                    },
                });
            } else {
                const user = (response as ApiResponse<User>).data;
                context.commit("setUserInfo", user);

                if (user) {
                    context.commit("setLocale", user.locale);
                    context.commit("loadState");
                    await context.dispatch("updateNotifications");

                    if (!store.getters.refreshIntervalId) {
                        context.commit("setRefreshIntervalId", setInterval(async () => await context.dispatch("updateNotifications"), 2000));
                    }
                }
            }

            return response;
        }

        return undefined;
    },
    async logout(context: ActionContext<State, any>) {
        if (isAuthorized()) {
            context.commit("setUserInfo", undefined);
            context.commit("clearState");
            context.commit("setLocale", Locale.Ru);
            localStorage.removeItem("api_token");
            context.commit("clearRefreshIntervalId");
            await router.push("/login");
        }
    }
};

export default actions;
