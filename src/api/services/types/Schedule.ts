import {ApiDay} from "@/api/services/enums/ApiDay";

export interface Schedule {
    day: ApiDay,
    date: Date,
    firstShiftUserId: number,
    secondShiftUserId: number,
    weekend: boolean,
}