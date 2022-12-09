import {ActionContext} from "vuex";
import {State} from "./state";
import {ApiService, UsersService} from "@/api/services";
import {ApiResponse, User} from "@/api/services/types";
import {Message} from "@/api/services/types/Message";
import {HttpStatusCode} from "axios";
import {isAuthorized} from "@/utils";
import router from "@/router";

const actions = {
  async updateUserInfo(context: ActionContext<State, any>) {
    const token = localStorage.getItem("api_token");

    if (token) {
      const response = await UsersService.WhoAmI();

      if (!response.status) {
        /* ToDo | Here must be a redirect to login page since any exception occurred on authorize via saved token */
        console.log((response as ApiResponse<Message>).data?.message);

        localStorage.removeItem("api_token");
        context.commit("setUserInfo", undefined);
      } else {
        context.commit("setUserInfo", (response as ApiResponse<User>).data);
      }

      return response;
    }

    return undefined;
  },
  async logout(context: ActionContext<State, any>) {
    if (isAuthorized()) {
      context.commit("setUserInfo", undefined);
      localStorage.removeItem("api_token");
      await router.push("/");
    }
  }
};

export default actions;
