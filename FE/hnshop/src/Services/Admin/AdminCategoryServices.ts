import ResponseWrapper from "../responseWrapper";
import { ICategory } from "../Interfaces/Interfaces";
import api from "../api";

const getAdminCategory = () => {
  return api
    .get<ResponseWrapper<ICategory[]>>(api.url.adminCategory)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const postAdminCategoryCreate = (
  name: string,
  urlName: string,
  description: string
) => {
  const data = { name, urlName, description };
  return api
    .post<ResponseWrapper<ICategory>>(api.url.adminCategoryCreate, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const postAdminCategoryUpdate = (
  id: number,
  name: string,
  urlName: string,
  description: string
) => {
  const data = { id, name, urlName, description };
  return api
    .put<ResponseWrapper<ICategory>>(
      `${api.url.adminCategoryUpdate}/${id}`,
      data
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const deleteAdminCategoryDelete = (id: number) => {
  return api
    .delete<ResponseWrapper<ICategory>>(`${api.url.adminCategoryDelete}/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const AdminCategoryServices = {
  getAdminCategory,
  postAdminCategoryCreate,
  postAdminCategoryUpdate,
  deleteAdminCategoryDelete,
};
export default AdminCategoryServices;
