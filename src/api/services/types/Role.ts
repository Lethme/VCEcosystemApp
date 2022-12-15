import Timestamp from "@/api/services/types/Timestamp";
import {ApiRole} from "@/api/services/enums/ApiRole";

interface Role extends Timestamp {
    id: number;
    value: ApiRole;
    description: string;
}

export default Role;