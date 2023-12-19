import ResponseWrapper from "../responseWrapper";
import api from "../api";
import { IProduct } from "../Interfaces/Interfaces";

const getAdminProduct = () => {
  return api
    .get<ResponseWrapper<IProduct[]>>(api.url.adminProduct)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const postAdminProductCreate = (
  name: string,
  price: number,
  saleoff: number,
  description: string,
  subCategoryId: number,
  colorId: number,
  files: File[]
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price.toString());
  formData.append("saleoff", saleoff.toString());
  formData.append("description", description);
  formData.append("subCategoryId", subCategoryId.toString());
  formData.append("colorId", colorId.toString());

  for (let i = 0; i < files.length; i++) {
    let image = files[i];
    formData.append("files", image);
  }

  return api
    .post<ResponseWrapper<IProduct>>(api.url.adminProductCreate, formData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const postAdminProductUpdate = (
  id: number,
  name: string,
  price: number,
  saleoff: number,
  description: string,
  subCategoryId: number,
  colorId: number,
  files: File[]
) => {
  const formData = new FormData();
  formData.append("id", id.toString());
  formData.append("name", name);
  formData.append("price", price.toString());
  formData.append("saleoff", saleoff.toString());
  formData.append("description", description);
  formData.append("subCategoryId", subCategoryId.toString());
  formData.append("colorId", colorId.toString());

  for (let i = 0; i < files.length; i++) {
    let image = files[i];
    formData.append("files", image);
  }
  return api
    .put<ResponseWrapper<IProduct>>(
      `${api.url.adminProductUpdate}/${id}`,
      formData
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const deleteAdminProductDelete = (id: number) => {
  return api
    .delete<ResponseWrapper<IProduct>>(`${api.url.adminProductDelete}/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const AdminProductServices = {
  getAdminProduct,
  postAdminProductCreate,
  postAdminProductUpdate,
  deleteAdminProductDelete,
};
export default AdminProductServices;
