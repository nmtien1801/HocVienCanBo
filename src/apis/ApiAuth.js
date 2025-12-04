import { ApiManager } from "./ApiManager";

const ApiAuth = {
    // TC
    LoginTCApi: (credentials) => ApiManager.post(`/useradmin/login`, credentials),
    ChangePasswordApi: (data) => ApiManager.post(`/useradmin/change-password`, data),
    StudentRegisterApi: (studentR) => ApiManager.post(`/student-register/register`, studentR),

    // HDB
    LoginHDBApi: (data) => ApiManager.post(`/user-hbd/login`, data),
    ProfileHBDApi: () => ApiManager.get(`/user-hbd/profile`),
}

export default ApiAuth;
