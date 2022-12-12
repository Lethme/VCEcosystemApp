import store from "@/store";

class Loader {
    static get State(): boolean {
        return store.getters.loading;
    }

    static set State(state: boolean) {
        store.commit("setLoadingState", state);
    }

    static SetState(state: boolean) {
        store.commit("setLoadingState", state);
    }

    static GetState() {
        return store.getters.loading;
    }

    static async Use<TReturn>(callback: () => TReturn | Promise<TReturn>): Promise<TReturn> {
        store.commit("setLoadingState", true);
        const response = await callback.call(null);
        store.commit("setLoadingState", false);

        return response;
    }
}

export default Loader;