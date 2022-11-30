import store from "@/store";

export class Loader {
    static get State(): boolean {
        return store.getters.loading;
    }

    static set State(state: boolean) {
        store.dispatch("setLoading", state);
    }

    static SetState(state: boolean) {
        store.dispatch("setLoading", state);
    }

    static GetState() {
        return store.getters.loading;
    }

    static async Use<TReturn>(callback: () => TReturn | Promise<TReturn>): Promise<TReturn> {
        this.SetState(true);
        const response = await callback.call(this);
        this.SetState(false);

        return response;
    }
}