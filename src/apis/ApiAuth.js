import { ApiManager } from "./ApiManager";

const ApiAuth = {
    LoginTCApi: (credentials) => ApiManager.post(`/useradmin/login`, credentials),
    ChangePasswordApi: (data) => ApiManager.post(`/useradmin/change-password`, data),
    StudentRegisterApi: (studentR) => ApiManager.post(`/student-register/register`, studentR),
}

export default ApiAuth;
