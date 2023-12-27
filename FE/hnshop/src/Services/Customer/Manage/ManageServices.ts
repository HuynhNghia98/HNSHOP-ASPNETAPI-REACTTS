import ResponseWrapper from "../../responseWrapper";
import api from "../../api";

const getUserInfor = (userId: string) => {
  return api
    .get<ResponseWrapper<object>>(`${api.url.userInfor}/${userId}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const postChangeUserInfor = (
  userId: string,
  name: string,
  phoneNumber: string,
  streetAddress: string,
  city: string,
  postalCode: string
) => {
  const data = { name, phoneNumber, streetAddress, city, postalCode };
  return api
    .post<ResponseWrapper<object>>(`${api.url.changeUserInfor}/${userId}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const postOrderStatus = (userId: string, status: string) => {
  const data = { status };
  return api
    .post<ResponseWrapper<object>>(`${api.url.orders}/${userId}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const postCancelOrder = (orderId: number) => {
  return api
    .post<ResponseWrapper<object>>(`${api.url.cancelOrder}/${orderId}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const ManageServices = {
  getUserInfor,
  postChangeUserInfor,
  postOrderStatus,
  postCancelOrder,
};
export default ManageServices;
