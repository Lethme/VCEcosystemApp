import {NotificationsService} from "@/api/services";
import {Notification} from "@/api/services/types";
import {App} from "vue";
import store from "@/store";

class NotificationsPlugin {
    static install(app: App) {
        Object.defineProperty(app.config.globalProperties, "$notifications", {
            get() { return store.getters.notifications as Array<Notification>; }
        });
        Object.defineProperty(app.config.globalProperties, "$readNotifications", {
            get() { return store.getters.readNotifications as Array<Notification>; }
        });
        Object.defineProperty(app.config.globalProperties, "$unreadNotifications", {
            get() { return store.getters.unreadNotifications as Array<Notification>; }
        });
        Object.defineProperty(app.config.globalProperties, "readNotification", {
            value: async function (id: number) {
                const response = await NotificationsService.Read(id);

                if (response && response.status) {
                    await store.dispatch("updateNotifications");
                }
            }
        });
        Object.defineProperty(app.config.globalProperties, "readAllNotifications", {
            value: async function () {
                const response = await NotificationsService.ReadAll();

                if (response && response.status) {
                    await store.dispatch("updateNotifications");
                }
            }
        });
        Object.defineProperty(app.config.globalProperties, "removeNotification", {
            value: async function (id: number) {
                const response = await NotificationsService.Remove(id);

                if (response && response.status) {
                    await store.dispatch("updateNotifications");
                }
            }
        });
        Object.defineProperty(app.config.globalProperties, "removeAllNotifications", {
            value: async function () {
                const response = await NotificationsService.RemoveAll();

                if (response && response.status) {
                    await store.dispatch("updateNotifications");
                }
            }
        });
    }
}

export default NotificationsPlugin;