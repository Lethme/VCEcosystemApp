import store from "@/store";

export const isAuthorized = (): boolean => {
    return store.getters.authorized;
}