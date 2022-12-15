import Role from "@/api/services/types/Role";
import Rate from "@/api/services/types/Rate";
import Timestamp from "@/api/services/types/Timestamp";
import Preference from "@/api/services/types/Preference";

interface User extends Timestamp {
    id: number;
    uuid: string;
    username: string;
    lastName: string;
    firstName: string;
    patronymic: string;
    roles: Array<Role>,
    rate?: Rate;
    preferences: Array<Preference>;
    logout: () => Promise<void>;
}

export default User;