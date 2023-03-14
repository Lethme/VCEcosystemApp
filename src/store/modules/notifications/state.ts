import {Notification} from "@/api/services/types";

export interface State {
    refreshIntervalId?: number;
    notifications: Array<Notification>;
}

const state: State = {
    refreshIntervalId: undefined,
    notifications: [],
};

export default state;
