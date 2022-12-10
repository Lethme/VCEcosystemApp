export const getDaysBetweenDates = (first: Date, second: Date) => {
    return Math.abs(first.getTime() - second.getTime()) / (1000 * 3600 * 24);
}