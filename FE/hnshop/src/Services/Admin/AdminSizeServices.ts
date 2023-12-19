import ResponseWrapper from "../responseWrapper";
import { ISize } from "../Interfaces/Interfaces";
import api from "../api";

const getAdminSize = () => {
  return api
    .get<ResponseWrapper<ISize[]>>(api.url.adminSize)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const postAdminSizeCreate = (name: string) => {
  const data = { name };
  return api
    .post<ResponseWrapper<ISize>>(api.url.adminSizeCreate, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const postAdminSizeUpdate = (id: number, name: string) => {
  const data = { id, name };
  return api
    .put<ResponseWrapper<ISize>>(`${api.url.adminSizeUpdate}/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const deleteAdminSizeDelete = (id: number) => {
  return api
    .delete<ResponseWrapper<ISize>>(`${api.url.adminSizeDelete}/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const AdminSizeServices = {
  getAdminSize,
  postAdminSizeCreate,
  postAdminSizeUpdate,
  deleteAdminSizeDelete,
};
export default AdminSizeServices;
