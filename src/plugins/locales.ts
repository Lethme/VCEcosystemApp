import {App} from "vue";
import store from "@/store";

class LocalesPlugin {
    static install(app: App) {
        Object.defineProperty(app.config.globalProperties, "$locale", {
            get() { return store.getters.localeRecord; }
        });
        Object.defineProperty(app.config.globalProperties, "$localeRecords", {
            get() { return store.getters.localeRecords; }
        });
    }
}

export default LocalesPlugin;