import { ApiManager } from "./ApiManager";

const ApiAuth = {
    LoginApi: (credentials) => ApiManager.post(`/useradmin/login`, credentials),
    ChangePasswordApi: (data) => ApiManager.post(`/useradmin/change-password`, data),
}

export default ApiAuth;
