import {ApiDay} from "@/api/services/enums/ApiDay";
import {ShiftIndex} from "@/api/services/types/ShiftIndex";

export interface EditPreferenceDto {
    day?: ApiDay;
    shiftIndex?: ShiftIndex;
    preference?: boolean;
}