import Timestamp from "@/api/services/types/Timestamp";

interface Preference extends Timestamp {
    id: number;
    day: number;
    shiftIndex: number;
    preference: boolean;
}

export default Preference;