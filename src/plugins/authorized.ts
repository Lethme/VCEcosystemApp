import {isAuthorized} from "@/utils";
import {App} from "vue";

class AuthorizedPlugin {
    install(app: App) {
        Object.defineProperty(app.config.globalProperties, "$authorized", {
           get() { return isAuthorized() }
        });
    }
}

export default AuthorizedPlugin;