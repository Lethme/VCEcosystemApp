import RequestPath from "./types/RequestPath";

export const getRequestPath = (path?: RequestPath) => {
  if (path) {
    if (typeof path === "string") {
      return (path as string).split("/").filter((part) => part);
    }

    if (
      Array.isArray(path) &&
      path.every((part) => typeof part === "string" || typeof part === "number")
    ) {
      return path.filter((part) => part).map((part) => part.toString());
    }
  }
  return undefined;
};
