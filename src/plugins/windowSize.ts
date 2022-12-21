import store from "@/store";
import {App} from "vue";

export interface WindowSize {
    width: number;
    height: number;
}

class WindowSizePlugin {
    static install(app: App) {
        Object.defineProperty(app.config.globalProperties, "$windowSize", {
            get() {
                return {
                    width: store.getters.windowWidth,
                    height: store.getters.windowHeight,
                }
            }
        });
        Object.defineProperty(app.config.globalProperties, "$windowWidth", {
            get() { return store.getters.windowWidth }
        });
        Object.defineProperty(app.config.globalProperties, "$windowHeight", {
            get() { return store.getters.windowHeight }
        });
        Object.defineProperty(app.config.globalProperties, "$mobile", {
            get() { return store.getters.mobile }
        });
    }
}

export default WindowSizePlugin;