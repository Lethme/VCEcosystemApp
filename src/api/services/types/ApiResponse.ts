import {HttpStatusCode} from "axios";

interface ApiResponse<TData = any> {
  status: boolean;
  statusCode: HttpStatusCode;
  data?: TData;
}

export default ApiResponse;
