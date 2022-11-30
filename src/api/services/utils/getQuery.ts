import QueryParam from "./types/QueryParam";

export const getQuery = (obj: Record<string, unknown>): Array<QueryParam> => {
  const entries = Object.entries(obj);
  const query = new Array<QueryParam>();

  entries.forEach((entry) =>
    query.push({
      key: entry[0],
      value: entry[1],
    })
  );
  return query;
};
