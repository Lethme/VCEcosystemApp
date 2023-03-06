import {User, ScheduleUser} from "@/api/services/types";

export const getFullUsername = (user?: User | ScheduleUser, options?: { short: boolean }): string | undefined => {
    if (!user) {
        return undefined;
    }

    if (options?.short) {
        return `${user.lastName[0].toLocaleUpperCase() + user.lastName.substring(1)} ${user.firstName[0].toLocaleUpperCase()}.${user.patronymic ? ' ' + user.patronymic[0].toLocaleUpperCase() + '.' : ''}`;
    }

    return `${user.lastName[0].toLocaleUpperCase() + user.lastName.substring(1)} ${user.firstName[0].toLocaleUpperCase() + user.firstName.substring(1)}${user.patronymic ? ' ' + user.patronymic[0].toLocaleUpperCase() + user.patronymic.substring(1) : ''}`;
}