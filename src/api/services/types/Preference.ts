import Timestamp from "@/api/services/types/Timestamp";

interface Preference extends Timestamp {
    id: number;
    day: number;
    shiftIndex: number;
    preference: boolean;
    createdAt: string;
    updatedAt: string;
}

export default Preference;