import RequestPath from "./RequestPath";

interface ApiRequestOptions<T = any> {
  path?: RequestPath;
  query?: T;
}

export default ApiRequestOptions;
