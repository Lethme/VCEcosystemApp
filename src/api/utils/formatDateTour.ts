export const formatDateTour = (date: string): string => {
  return new Date(date).toLocaleString("ru", {
    month: "long",
    day: "numeric",
  });
};
