import {HttpStatusCode} from "axios";

interface ApiResponse<TData = undefined> {
  status: boolean;
  statusCode: HttpStatusCode;
  data?: TData;
}

export default ApiResponse;
