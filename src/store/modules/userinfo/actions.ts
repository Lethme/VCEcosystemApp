import {ActionContext} from "vuex";
import {State} from "./state";
import {UsersService} from "@/api/services";
import {ApiResponse, User} from "@/api/services/types";
import {Message} from "@/api/services/types/Message";
import {HttpStatusCode} from "axios";

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
    }
  }
};

export default actions;
