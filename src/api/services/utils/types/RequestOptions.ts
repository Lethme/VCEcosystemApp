import RequestPath from "./RequestPath";
import RequestPrefix from "./RequestPrefix";
import RequestProtocol from "./RequestProtocol";
import RequestPort from "./RequestPort";

interface RequestOptions<T = any> {
  protocol?: RequestProtocol;
  port?: RequestPort;
  path?: RequestPath;
  prefix?: RequestPrefix;
  query?: T;
}

export default RequestOptions;
