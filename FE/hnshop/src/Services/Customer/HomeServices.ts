import ResponseWrapper from "../responseWrapper";
import { ICategory, IProduct, ISubCategory } from "../Interfaces/Interfaces";
import api from "../api";

const getLayoutHeader = () => {
  return api
    .get<ResponseWrapper<ISubCategory[]>>(api.url.header)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const getCartCount = (userId: string) => {
  return api
    .get<ResponseWrapper<number>>(`${api.url.cartCount}/${userId}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const postSearch = (search: string) => {
  const data = { search };
  return api
    .post<ResponseWrapper<IProduct[]>>(api.url.search, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const HomeServices = {
  getLayoutHeader,
  getCartCount,
  postSearch,
};
export default HomeServices;
