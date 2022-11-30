import { RequestPrefix } from "./types";

export const getRequestPrefix = (prefix?: RequestPrefix) => {
  if (prefix) {
    if (typeof prefix === "string") {
      return (prefix as string).split("/").filter((part) => part);
    }

    if (
      Array.isArray(prefix) &&
      prefix.every((part) => typeof part === "string")
    ) {
      return prefix.filter((part) => part);
    }
  }
  return undefined;
};
