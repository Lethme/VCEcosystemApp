export interface EditUserDto {
    username?: string;
    lastName?: string;
    firstName?: string;
    patronymic?: string;
    roles?: Array<string>,
    rateId?: number;
}