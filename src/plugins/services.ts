import {Loader} from "@/utils";
import {App} from "vue";
import store from "@/store";

class ServicesPlugin {
    static install(app: App) {
        Object.defineProperty(app.config.globalProperties, "$services", {
            get() { return store.getters.services; }
        });
        Object.defineProperty(app.config.globalProperties, "$allServices", {
            get() { return store.getters.allServices; }
        });
        Object.defineProperty(app.config.globalProperties, "$removedServices", {
            get() { return store.getters.removedServices; }
        });
        Object.defineProperty(app.config.globalProperties, "$daysToRemoveOrders", {
            get() { return store.getters.daysToRemoveOrders; }
        });
        app.config.globalProperties.refreshServices = async () => {
            await Loader.Use(async () => {
                await store.dispatch("updateServices");
            });
        }
    }
}

export default ServicesPlugin;