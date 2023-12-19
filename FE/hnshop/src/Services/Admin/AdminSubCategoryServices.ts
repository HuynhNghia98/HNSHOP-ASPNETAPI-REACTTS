import ResponseWrapper from "../responseWrapper";
import { ISubCategory } from "../Interfaces/Interfaces";
import api from "../api";

const getAdminSubCategory = () => {
  return api
    .get<ResponseWrapper<ISubCategory[]>>(api.url.adminSubCategory)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const postAdminSubCategoryCreate = (
  name: string,
  urlName: string,
  description: string,
  categoryId: number
) => {
  const data = { name, urlName, description, categoryId };
  return api
    .post<ResponseWrapper<ISubCategory>>(api.url.adminSubCategoryCreate, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const postAdminSubCategoryUpdate = (
  id: number,
  name: string,
  urlName: string,
  description: string,
  categoryId: number
) => {
  const data = { id, name, urlName, description, categoryId };
  return api
    .put<ResponseWrapper<ISubCategory>>(
      `${api.url.adminSubCategoryUpdate}/${id}`,
      data
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const deleteAdminSubCategoryDelete = (id: number) => {
  return api
    .delete<ResponseWrapper<ISubCategory>>(
      `${api.url.adminSubCategoryDelete}/${id}`
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const AdminSubCategoryServices = {
  getAdminSubCategory,
  postAdminSubCategoryCreate,
  postAdminSubCategoryUpdate,
  deleteAdminSubCategoryDelete,
};
export default AdminSubCategoryServices;
