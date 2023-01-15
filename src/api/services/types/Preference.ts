import {ApiDay} from "@/api/services/enums/ApiDay";
import {ShiftIndex} from "@/api/services/types/ShiftIndex";
import Timestamp from "@/api/services/types/Timestamp";

interface Preference extends Timestamp {
    id: number;
    day: ApiDay;
    shiftIndex: ShiftIndex;
    preference: boolean;
    createdAt: string;
    updatedAt: string;
}

export default Preference;