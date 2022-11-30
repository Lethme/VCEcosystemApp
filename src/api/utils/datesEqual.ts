import { getDateWithoutTime } from "@/api/utils/getDateWithoutTime";

export const datesEqual = (first: Date, second: Date): boolean => {
  if (!first || !second) return false;

  const firstDate = getDateWithoutTime(first);
  const secondDate = getDateWithoutTime(second);

  return firstDate.getTime() == secondDate.getTime();
};
