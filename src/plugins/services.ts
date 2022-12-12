import {Loader} from "@/utils";
import {App} from "vue";
import store from "@/store";

class ServicesPlugin {
    static install(app: App) {
        Object.defineProperty(app.config.globalProperties, "$services", {
            get() { return store.getters.services; }
        });
        Object.defineProperty(app.config.globalProperties, "$daysToRemoveOrders", {
            get() { return store.getters.daysToRemoveOrders; }
        });
        app.config.globalProperties.refreshServices = async () => {
            Loader.SetState(true);
            await store.dispatch("updateServices");
            Loader.SetState(false);
        }
    }
}

export default ServicesPlugin;