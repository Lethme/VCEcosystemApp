import store from "@/store";
import {App} from "vue";
import {Loader} from "@/utils";

class UserPlugin {
    static install(app: App) {
        Object.defineProperty(app.config.globalProperties, "$user", {
            get() {
                return {
                    ...store.getters.userInfo,
                    logout: async () => await Loader.Use(async () => await store.dispatch("logout")),
                }
            }
        });
    }
}

export default UserPlugin;