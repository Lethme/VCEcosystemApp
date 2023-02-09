import Role from "@/api/services/types/Role";
import Rate from "@/api/services/types/Rate";
import Timestamp from "@/api/services/types/Timestamp";
import Preference from "@/api/services/types/Preference";
import {Locale} from "@/store/modules/locales/types/Locale";

interface User extends Timestamp {
    id: number;
    uuid: string;
    hasProfilePicture: boolean;
    username: string;
    lastName: string;
    firstName: string;
    patronymic: string;
    locale: Locale;
    roles: Array<Role>,
    rate?: Rate;
    preferences: Array<Preference>;
    logout: () => Promise<void>;
    getProfilePictureUrl: () => string;
}

export default User;