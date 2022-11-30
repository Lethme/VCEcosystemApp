import { getQuery, getRequestPath, getRequestPrefix } from "./index";
import { RequestHost, RequestOptions } from "./types";

export const getRequestUrl = <T = any>(
  host: RequestHost,
  options?: RequestOptions
): string => {
  let url = `${options?.protocol ? options?.protocol + ":" : ""}//${host}${
    options?.port ? ":" + options?.port : ""
  }`;
  const prefix = getRequestPrefix(options?.prefix);
  const path = getRequestPath(options?.path);

  if (prefix) {
    url += `/${prefix.join("/")}`;
  }

  if (path) {
    url += `/${path.join("/")}`;
  }

  if (options?.query) {
    const queryParams = getQuery(options?.query);
    const queryLine = queryParams
      .map((param) => `${param.key}=${param.value}`)
      .join("&");

    if (queryLine) {
      url += `?${queryLine}`;
    }
  }
  return url;
};
