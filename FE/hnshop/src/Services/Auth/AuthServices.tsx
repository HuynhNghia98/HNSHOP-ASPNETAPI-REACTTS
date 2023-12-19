import ResponseWrapper from "../responseWrapper";
import api from "../api";

interface AuthResponse {
    email: string,
    token: string,
}

const postLogin = (username: string, password: string) => {
    const data = { username, password };
    return api
        .post<ResponseWrapper<AuthResponse>>(`${api.url.login}`, data)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data.errors;
        });
};

const postRegister = (username: string, confirmPassword: string, password: string, name: string, phoneNumber: string, role: string) => {
    const data = { username, confirmPassword, password, name, phoneNumber, role };
    return api
        .post<ResponseWrapper<AuthResponse>>(`${api.url.register}`, data)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data.errors;
        });
};

const AuthServices = {
    postLogin, postRegister
}

export default AuthServices;