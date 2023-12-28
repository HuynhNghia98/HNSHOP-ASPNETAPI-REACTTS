import ResponseWrapper from "../../responseWrapper";
import api from "../../api";

const postOrder = (
  userId: string,
  paymentIntentId: string,
  status: string,
  total: number,
  name: string,
  phoneNumber: string,
  streetAddress: string,
  city: string,
  postalCode: string
) => {
  const data = {
    userId,
    paymentIntentId,
    status,
    total,
    name,
    phoneNumber,
    streetAddress,
    city,
    postalCode,
  };
  return api
    .post<ResponseWrapper<object>>(api.url.addOrder, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const OrderServices = {
  postOrder,
};
export default OrderServices;
