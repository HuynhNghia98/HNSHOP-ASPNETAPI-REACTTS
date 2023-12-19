import ResponseWrapper from "../responseWrapper";
import api from "../api";

const getCartsAll = (userId: string) => {
  return api
    .get<ResponseWrapper<object>>(`${api.url.cart}/${userId}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const postAddToCart = (
  userId: string,
  productDetailId: number,
  quantity: number
) => {
  const data = { userId, productDetailId, quantity };
  return api
    .post<ResponseWrapper<object>>(api.url.addToCart, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const postAddOneToCart = (id: number, userId: string) => {
  const data = { userId };
  return api
    .post<ResponseWrapper<object>>(`${api.url.addOneToCart}/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const postMinusOneToCart = (id: number, userId: string) => {
  const data = { userId };
  return api
    .post<ResponseWrapper<object>>(`${api.url.minusOneToCart}/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const postDeleteCart = (id: number, userId: string) => {
  const data = { userId };
  return api
    .post<ResponseWrapper<object>>(`${api.url.deleteCart}/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const getDeliveryInformation = (userId: string) => {
  return api
    .get<ResponseWrapper<object>>(`${api.url.deliveryInformation}/${userId}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const postAddDeliveryInformation = (
  userId: string,
  name: string,
  phoneNumber: string,
  streetAddress: string,
  city: string,
  postalCode: string
) => {
  const data = { name, phoneNumber, streetAddress, city, postalCode };
  return api
    .post<ResponseWrapper<object>>(
      `${api.url.addDeliveryInformation}/${userId}`,
      data
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const CartServices = {
  getCartsAll,
  postAddToCart,
  postAddOneToCart,
  postMinusOneToCart,
  postDeleteCart,
  getDeliveryInformation,
  postAddDeliveryInformation,
};
export default CartServices;
