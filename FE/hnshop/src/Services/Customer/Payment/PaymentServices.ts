import ResponseWrapper from "../../responseWrapper";
import api from "../../api";

const postPayment = (userId: string) => {
  const data = { userId };
  return api
    .post<ResponseWrapper<object>>(api.url.payment, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const PaymentServices = {
  postPayment,
};
export default PaymentServices;
