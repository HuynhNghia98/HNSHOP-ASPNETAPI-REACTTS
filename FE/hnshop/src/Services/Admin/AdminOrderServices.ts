import ResponseWrapper from "../responseWrapper";
import { IOrder } from "../Interfaces/Interfaces";
import api from "../api";

const postAdminOrder = (status: string) => {
  const data = { status };
  return api
    .post<ResponseWrapper<IOrder[]>>(api.url.adminOrders, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const getAdminOrderDetail = (id: number) => {
  return api
    .get<ResponseWrapper<IOrder>>(`${api.url.adminOrder}/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const postAdminChangeOrderStatus = (id: number, status: string) => {
  const data = { status };
  return api
    .post<ResponseWrapper<IOrder>>(
      `${api.url.adminChangeOrderStatus}/${id}`,
      data
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const AdminOrderServices = {
  postAdminOrder,
  getAdminOrderDetail,
  postAdminChangeOrderStatus,
};
export default AdminOrderServices;
