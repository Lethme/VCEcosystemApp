import {Action, ActionContext} from "vuex";
import { State } from "./state";
import {ApiService, UsersService} from "@/api/services";
import {ApiResponse, User} from "@/api/services/types";
import {Message} from "@/api/services/types/Message";

const actions = {
  async updateUserData(context: ActionContext<State, any>) {
    const token = localStorage.getItem("api_token");

    if (token) {
      const response = await UsersService.WhoAmI();

      if (!response.status) {
        /* ToDo | Here must be a redirect to login page since any exception occurred on authorize via saved token */
        console.log((response as ApiResponse<Message>).data?.message);
      } else {
        context.commit("setUserInfo", (response as ApiResponse<User>).data);
      }
    }
  }
};

export default actions;
