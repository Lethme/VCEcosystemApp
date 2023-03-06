import {Schedule} from "@/api/services/types/Schedule";
import {ScheduleUser} from "@/api/services/types/ScheduleUser";

export interface ScheduleResponse {
    schedule: Array<Schedule>;
    users: Array<ScheduleUser>;
}