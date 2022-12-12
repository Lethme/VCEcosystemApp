import store from "@/store";

class Loader {
    static get State(): boolean {
        return store.getters.loading;
    }

    static set State(state: boolean) {
        store.dispatch("setLoading", state);
    }

    static SetState(state: boolean) {
        this.State = state;
    }

    static GetState() {
        return this.State;
    }

    static async Use<TReturn>(callback: () => TReturn | Promise<TReturn>): Promise<TReturn> {
        this.SetState(true);
        const response = await callback.call(this);
        this.SetState(false);

        return response;
    }
}

export default Loader;