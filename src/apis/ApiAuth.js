import { ApiManager } from "./ApiManager";

const ApiAuth = {
    LoginApi: (credentials) => ApiManager.post(`/auth/login`, credentials),
}

export default ApiAuth;
