export const getRequestQuery = <T = any>(query?: T) => {
  if (query) {
    return JSON.parse(JSON.stringify(query));
  }
  return undefined;
};
