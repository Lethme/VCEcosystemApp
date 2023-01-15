import {ApiDay} from "@/api/services/enums/ApiDay";
import {ShiftIndex} from "@/api/services/types/ShiftIndex";

export interface CreatePreferenceDto {
    day: ApiDay;
    shiftIndex: ShiftIndex;
    preference: boolean;
}