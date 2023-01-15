export interface CreateUserDto {
    username: string;
    lastName: string;
    firstName: string;
    patronymic: string;
    roles: Array<string>,
    rateId?: number;
}