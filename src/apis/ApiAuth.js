import { ApiManager } from "./ApiManager";

const ApiAuth = {
    // TC
    LoginTCApi: (credentials) => ApiManager.post(`/useradmin/login`, credentials),
    RestPassWordApi: (data) => ApiManager.post(`/useradmin/reset-password`, data),
    ChangePasswordApi: (data) => ApiManager.post(`/useradmin/change-password`, data),
    StudentRegisterApi: (studentR) => ApiManager.post(`/student-register/register`, studentR),
    
    // HDB
    LoginHDBApi: (data) => ApiManager.post(`/user-hbd/login`, data),
    ChangePasswordHBDApi: (data) => ApiManager.post(`/user-hbd/change-password`, data),
}

export default ApiAuth;
