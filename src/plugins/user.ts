import {ApiService} from "@/api/services";
import store from "@/store";
import {App} from "vue";
import {Loader} from "@/utils";
import {ApiRole} from "@/api/services/enums/ApiRole";
import {User} from "@/api/services/types";

class UserPlugin {
    static install(app: App) {
        Object.defineProperty(app.config.globalProperties, "$user", {
            get() {
                return {
                    ...store.getters.userInfo,
                    getProfilePictureUrl: () => {
                        const user: User = store.getters.userInfo;
                        return user ? ApiService.GetProfilePicturePath(user.uuid) : undefined;
                    },
                    logout: async () => await Loader.Use(async () => {
                        await (() => new Promise(resolve => setTimeout(resolve, 500)))();
                        await store.dispatch("logout");
                    }),
                }
            }
        });

        Object.defineProperty(app.config.globalProperties, "$rootAccess", {
            get() {
                const user = store.getters.userInfo;

                if (user) {
                    return (store.getters.userInfo as User)?.roles.some(role => role.value === ApiRole.Root);
                }

                return false;
            }
        });
    }
}

export default UserPlugin;