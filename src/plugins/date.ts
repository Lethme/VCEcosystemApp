import {App} from "vue";
import store from "@/store";

class DatePlugin {
    static install(app: App) {
        Object.defineProperty(app.config.globalProperties, "$date", {
            get() { return store.getters.date; }
        });
        Object.defineProperty(app.config.globalProperties, "$formattedDate", {
            get() { return store.getters.formattedDate; }
        });
    }
}

export default DatePlugin;