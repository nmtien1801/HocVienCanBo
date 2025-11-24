import { ApiManager } from "./ApiManager";

const ApiAuth = {
    LoginApi: (credentials) => ApiManager.post(`/useradmin/login`, credentials),
}

export default ApiAuth;
