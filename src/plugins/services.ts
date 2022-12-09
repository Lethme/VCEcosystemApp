import {App} from "vue";
import store from "@/store";

class ServicesPlugin {
    static install(app: App) {
        Object.defineProperty(app.config.globalProperties, "$services", {
            get() { return store.getters.services; }
        });
        app.config.globalProperties.refreshServices = async () => {
            await store.dispatch("updateServices");
        }
    }
}

export default ServicesPlugin;