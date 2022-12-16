import {pictureFallback} from "@/api/utils/constans";
import {App} from "vue";

export interface WindowSize {
    width: number;
    height: number;
}

class UtilsPlugin {
    static install(app: App) {
        Object.defineProperty(app.config.globalProperties, "$pictureFallback", {
            get() {
                return pictureFallback;
            }
        });
    }
}

export default UtilsPlugin;