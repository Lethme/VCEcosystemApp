import { getDateWithoutTime } from "@/api/utils/getDateWithoutTime";

export const isDateBetween = (date: Date, from: Date, to: Date): boolean => {
  if (!date || !from || !to) return false;

  let dateFrom = getDateWithoutTime(from);
  let dateTo = getDateWithoutTime(to);

  if (dateFrom.getTime() > dateTo.getTime()) {
    const temp = dateTo;
    dateTo = dateFrom;
    dateFrom = temp;
  }

  const baseDate = getDateWithoutTime(date);

  return (
    baseDate.getTime() >= dateFrom.getTime() &&
    baseDate.getTime() <= dateTo.getTime()
  );
};
