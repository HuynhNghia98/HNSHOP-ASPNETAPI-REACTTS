import ResponseWrapper from "../responseWrapper";
import { IColor } from "../Interfaces/Interfaces";
import api from "../api";

const getAdminColor = () => {
  return api
    .get<ResponseWrapper<IColor[]>>(api.url.adminColor)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const postAdminColorCreate = (name: string) => {
  const data = { name };
  return api
    .post<ResponseWrapper<IColor>>(api.url.adminColorCreate, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const postAdminColorUpdate = (id: number, name: string) => {
  const data = { id, name };
  return api
    .put<ResponseWrapper<IColor>>(`${api.url.adminColorUpdate}/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const deleteAdminColorDelete = (id: number) => {
  return api
    .delete<ResponseWrapper<IColor>>(`${api.url.adminColorDelete}/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const AdminColorServices = {
  getAdminColor,
  postAdminColorCreate,
  postAdminColorUpdate,
  deleteAdminColorDelete,
};
export default AdminColorServices;
