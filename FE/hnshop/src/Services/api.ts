import axios from "axios";

// const sessionId = localStorage.getItem("sessionId");

const url = {
  baseUrl: "https://localhost:5000/api",
  // auth
  login: "Auth/Login",
  register: "Auth/Register",

  //admin
  //category
  adminCategory: "Admin/Category/GetAll",
  adminCategoryCreate: "Admin/Category/Create",
  adminCategoryUpdate: "Admin/Category/Update",
  adminCategoryDelete: "Admin/Category/Delete",
  //subcategory
  adminSubCategory: "Admin/SubCategory/GetAll",
  adminSubCategoryCreate: "Admin/SubCategory/Create",
  adminSubCategoryUpdate: "Admin/SubCategory/Update",
  adminSubCategoryDelete: "Admin/SubCategory/Delete",
  //product
  adminProduct: "Admin/Product/GetAll",
  adminProductCreate: "Admin/Product/Create",
  adminProductUpdate: "Admin/Product/Update",
  adminProductDelete: "Admin/Product/Delete",
  //productDetail
  adminProductDetail: "Admin/ProductDetail/GetAll",
  adminProductDetailCreate: "Admin/ProductDetail/Create",
  adminProductDetailUpdate: "Admin/ProductDetail/Update",
  adminProductDetailDelete: "Admin/ProductDetail/Delete",
  //color
  adminColor: "Admin/Color/GetAll",
  adminColorCreate: "Admin/Color/Create",
  adminColorUpdate: "Admin/Color/Update",
  adminColorDelete: "Admin/Color/Delete",
  //size
  adminSize: "Admin/Size/GetAll",
  adminSizeCreate: "Admin/Size/Create",
  adminSizeUpdate: "Admin/Size/Update",
  adminSizeDelete: "Admin/Size/Delete",
  //user
  adminUser: "Admin/User/GetAll",
  adminUserLockUnlock: "Admin/User/lockUnlock",
  //order
  adminOrders: "Admin/Order/GetOrders",
  adminOrder: "Admin/Order/GetOrder",
  adminChangeOrderStatus: "Admin/Order/ChangeOrderStatus",

  //customer
  //header
  header: "Customer/LayoutCustomer/GetAll",
  search: "Customer/LayoutCustomer/Search",
  cartCount: "Customer/LayoutCustomer/GetCart",
  category: "Customer/CategoryCustomer/Get",
  categoryFilter: "Customer/CategoryCustomer/Filter",
  subCategory: "Customer/SubCategoryCustomer/Get",
  subCategoryFilter: "Customer/SubCategoryCustomer/Filter",
  productDetail: "Customer/ProductDetailCustomer/Get",
  //cart
  addToCart: "Cart/AddToCart",
  cart: "Cart/GetAll",
  addOneToCart: "Cart/Add",
  minusOneToCart: "Cart/Minus",
  deleteCart: "Cart/Delete",
  deliveryInformation: "Cart/GetDeliveryInformation",
  addDeliveryInformation: "Cart/AddDeliveryInformation",
  //payment
  payment: "Payment",
  //order
  addOrder: "Order/AddOrder",
  //manage
  userInfor: "Manage/GetUserInfor",
  changeUserInfor: "Manage/ChangeUserInfor",
  orders: "Manage/GetOrders",
  cancelOrder: "Manage/CancelOrder",
  //review
  review: "Review/AddReview",
};

const instance = axios.create({
  baseURL: url.baseUrl,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const api = {
  url: url,
  instance,
  get: instance.get,
  post: instance.post,
  put: instance.put,
  delete: instance.delete,
  patch: instance.patch,
};

export default api;
