interface ApiResponse<TData = any, TMeta = any, TLinks = any> {
  data?: TData;
  meta?: TMeta;
  links?: TLinks;
}

export default ApiResponse;
