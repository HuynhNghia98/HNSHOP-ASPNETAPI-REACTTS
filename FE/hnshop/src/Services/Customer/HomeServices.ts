import ResponseWrapper from "../responseWrapper";
import { ICategory, ISubCategory } from "../Interfaces/Interfaces";
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

const HomeServices = {
  getLayoutHeader,
  getCartCount,
};
export default HomeServices;
