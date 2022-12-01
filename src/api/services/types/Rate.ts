import Timestamp from "@/api/services/types/Timestamp";

interface Rate extends Timestamp {
    id: number;
    title: string;
    rate: number;
}

export default Rate;