import ResponseWrapper from "../responseWrapper";
import { IUser } from "../Interfaces/Interfaces";
import api from "../api";

const getAdminUser = () => {
  return api
    .get<ResponseWrapper<IUser[]>>(api.url.adminUser)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const postAdminUserLockUnlock = (id: number) => {
  return api
    .post<ResponseWrapper<IUser>>(`${api.url.adminUserLockUnlock}/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const AdminUserServices = {
  getAdminUser,
  postAdminUserLockUnlock,
};
export default AdminUserServices;
