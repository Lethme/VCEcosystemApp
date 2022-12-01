import Timestamp from "@/api/services/types/Timestamp";

interface Role extends Timestamp {
    id: number;
    value: string;
    description: string;
}

export default Role;