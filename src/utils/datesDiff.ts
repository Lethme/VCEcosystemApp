import dayjs, {Dayjs, OpUnitType, QUnitType} from 'dayjs';

type DateType = string | Date | Dayjs;

export function datesDiff(startDate: DateType, endDate: DateType, unit?: QUnitType | OpUnitType): number {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    const diff = end.diff(start, unit);

    return Math.abs(diff);
}