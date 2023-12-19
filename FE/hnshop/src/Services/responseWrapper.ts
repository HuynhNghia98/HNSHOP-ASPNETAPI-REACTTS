type ResponseWrapper<T> = {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: [];
  result: T;
};

export default ResponseWrapper;
