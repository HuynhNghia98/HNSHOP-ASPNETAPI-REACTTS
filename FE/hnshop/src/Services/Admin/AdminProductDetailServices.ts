import ResponseWrapper from "../responseWrapper";
import api from "../api";
import { IProductDetail } from "../Interfaces/Interfaces";

const getAdminProductDetail = () => {
  return api
    .get<ResponseWrapper<IProductDetail[]>>(api.url.adminProductDetail)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const postAdminProductDetailCreate = (
  productId: number,
  sizeId: number,
  quantity: number
) => {
  const data = {
    productId,
    sizeId,
    quantity,
  };
  return api
    .post<ResponseWrapper<IProductDetail>>(
      api.url.adminProductDetailCreate,
      data
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const postAdminProductDetailUpdate = (
  id: number,
  productId: number,
  sizeId: number,
  quantity: number
) => {
  const data = {
    id,
    productId,
    sizeId,
    quantity,
  };
  return api
    .put<ResponseWrapper<IProductDetail>>(
      `${api.url.adminProductDetailUpdate}/${id}`,
      data
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const deleteAdminProductDetailDelete = (id: number) => {
  return api
    .delete<ResponseWrapper<IProductDetail>>(
      `${api.url.adminProductDetailDelete}/${id}`
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const AdminProductDetailServices = {
  getAdminProductDetail,
  postAdminProductDetailCreate,
  postAdminProductDetailUpdate,
  deleteAdminProductDetailDelete,
};
export default AdminProductDetailServices;
